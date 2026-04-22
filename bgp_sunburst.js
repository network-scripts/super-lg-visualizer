/**
 * bgp-sunburst.js
 *
 * A bookmarklet that visualises BGP AS-path data from bgp.tools/super-lg
 * as an interactive zoomable sunburst chart drawn on an HTML5 Canvas.
 *
 * Usage
 * -----
 * 1. Minify this file (e.g. with terser) and prefix with  javascript:
 * 2. Save the result as a browser bookmark
 * 3. Navigate to https://bgp.tools/super-lg and search for any prefix
 * 4. Click the bookmark — a full-screen overlay appears
 *
 * Interactions
 * ------------
 *   Click arc    → zoom into that subtree
 *   Click centre → zoom out one level
 *   Hover        → tooltip with org name, path count, BGP communities
 *   ✕ button     → close
 *
 * Self-contained: no external libraries, no network requests.
 * Works in Firefox; respects devicePixelRatio for crisp HiDPI rendering.
 *
 * Author: generated iteratively with Claude (Anthropic), April 2026
 * License: MIT
 */
(function () {

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. DOM PARSE
  //    Walk every node in the page in document order using TreeWalker.
  //    bgp.tools renders each BGP record as a sequence of text nodes and
  //    <abbr> elements, e.g.:
  //
  //      TEXT  " BGP.as_path: "
  //      ABBR  title="Org Name"  >12345<
  //      TEXT  " "
  //      ABBR  title="..."       >6789<
  //      TEXT  " \n BGP.community: (65000,100) "
  //      ABBR  title="(65000,100)"  >[decoded meaning]<
  //      TEXT  " \n BGP.large_community: "
  //      ABBR  title="(65000,1,2)"  >[decoded meaning]<
  //      TEXT  "  \n   unicast [...] \n Type: BGP\n BGP.as_path: "  ← next record
  //
  //    Important: the text node that ends one community block and begins the
  //    next as_path line is a SINGLE text node containing both the unicast
  //    header and "BGP.as_path:". Communities must therefore be flushed at
  //    the START of each new record, not at the end of the previous one.
  // ═══════════════════════════════════════════════════════════════════════════

  var paths      = [];   // [ [asn, asn, …], … ]  one entry per BGP record
  var names      = {};   // asn (string) → organisation name
  var asnComms   = {};   // asn (string) → [ community string, … ]

  // State for the current record being parsed
  var cur         = null;   // path array under construction
  var curPathAsns = [];     // ASNs seen in this record (for community attachment)
  var curComms    = [];     // community strings collected for this record
  var inComm      = false;  // true while inside a BGP.community / BGP.large_community block

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL);
  var nd;

  while ((nd = walker.nextNode())) {

    // ── Text nodes ──────────────────────────────────────────────────────────
    if (nd.nodeType === 3) {
      var txt = nd.textContent;

      if (txt.indexOf('BGP.as_path:') >= 0) {
        // ── New record: flush communities from the previous record first ──
        if (curPathAsns.length && curComms.length) {
          curPathAsns.forEach(function (a) {
            if (!asnComms[a]) asnComms[a] = [];
            curComms.forEach(function (c) {
              if (asnComms[a].indexOf(c) < 0) asnComms[a].push(c);
            });
          });
        }
        cur = []; curPathAsns = []; curComms = []; inComm = false;
        paths.push(cur);

      } else if (txt.indexOf('BGP.community:') >= 0 || txt.indexOf('BGP.large_community:') >= 0) {
        // ── Community header line: extract any raw (x,y) tuples ──────────
        inComm = true;
        var raw = txt.replace(/BGP\.(large_)?community:/g, '');
        var m; var re = /\(\s*[\d,\s]+\)/g;
        while ((m = re.exec(raw)) !== null) curComms.push(m[0].replace(/\s+/g, ''));

      } else if (inComm) {
        // ── Continuation of community block: pick up more raw tuples ─────
        var re2 = /\(\s*[\d,\s]+\)/g; var m2;
        while ((m2 = re2.exec(txt)) !== null) curComms.push(m2[0].replace(/\s+/g, ''));
      }

    // ── ABBR elements ───────────────────────────────────────────────────────
    } else if (nd.nodeType === 1 && nd.tagName === 'ABBR') {
      var t     = nd.textContent.trim();
      var title = nd.getAttribute('title') || '';

      if (/^\d+$/.test(t) && cur !== null && !inComm) {
        // AS number inside BGP.as_path — green dotted abbr
        // Consecutive duplicates (prepend padding) are collapsed to one hop
        names[t] = title || ('AS' + t);
        if (!cur.length || cur[cur.length - 1] !== t) {
          cur.push(t);
          curPathAsns.push(t);
        }

      } else if (inComm) {
        // Community abbr — blue dotted; title = raw tuple, text = decoded meaning
        var decoded = nd.textContent.trim();
        if (decoded) curComms.push(decoded);
        if (title)   curComms.push(title);
      }
    }
  }

  // Flush communities for the very last record
  if (curPathAsns.length && curComms.length) {
    curPathAsns.forEach(function (a) {
      if (!asnComms[a]) asnComms[a] = [];
      curComms.forEach(function (c) { if (asnComms[a].indexOf(c) < 0) asnComms[a].push(c); });
    });
  }

  paths = paths.filter(function (p) { return p.length >= 2; });
  if (!paths.length) { alert('No BGP AS paths found on this page.'); return; }


  // ═══════════════════════════════════════════════════════════════════════════
  // 2. ORIGIN AS
  //    The origin AS is the last unique ASN in the majority of paths
  //    (i.e. the AS that announces the prefix). Paths are written
  //    collector → … → origin on bgp.tools, so we look at the final hop.
  // ═══════════════════════════════════════════════════════════════════════════

  var oc = {};
  paths.forEach(function (p) {
    var l = p[p.length - 1];
    oc[l] = (oc[l] || 0) + 1;
  });
  var origin = Object.keys(oc).sort(function (a, b) { return oc[b] - oc[a]; })[0];


  // ═══════════════════════════════════════════════════════════════════════════
  // 3. TRIE
  //    Build a prefix-trie of AS paths, rooted at the origin AS.
  //    Each path is reversed (origin first) before insertion so that
  //    the trie naturally represents transit topology: depth 1 = first
  //    transit away from origin, depth 2 = second transit, etc.
  //
  //    cnt  = total paths that pass through this node
  //    val  = sum of leaf counts below (used to size arcs proportionally)
  // ═══════════════════════════════════════════════════════════════════════════

  function makeNode(asn) {
    return { asn: asn, name: names[asn] || ('AS' + asn), ch: {}, cnt: 0, val: 0, parentAsn: null };
  }

  var root = makeNode(origin);

  paths.forEach(function (path) {
    var rev = path.slice().reverse();
    var si  = rev.indexOf(origin);
    if (si < 0) si = 0;
    var node = root;
    root.cnt++;
    for (var i = si + 1; i < rev.length; i++) {
      var a = rev[i];
      if (!node.ch[a]) node.ch[a] = makeNode(a);
      node = node.ch[a];
      node.cnt++;
    }
  });

  // Assign val: leaf nodes get their cnt; internal nodes get sum of children
  function setVal(n) {
    var ks = Object.keys(n.ch);
    if (!ks.length) { n.val = n.cnt; return; }
    n.val = 0;
    ks.forEach(function (k) { setVal(n.ch[k]); n.val += n.ch[k].val; });
  }
  setVal(root);


  // ═══════════════════════════════════════════════════════════════════════════
  // 4. ARC LIST
  //    Flatten the trie into a list of arc descriptors using a recursive
  //    pre-order traversal. Each node is assigned an angular span
  //    proportional to its val within its parent's span.
  //
  //    a0, a1  — arc start/end in radians (0 = right, counter-clockwise)
  //    depth   — ring index (0 = centre circle)
  // ═══════════════════════════════════════════════════════════════════════════

  var arcs = []; var maxDepth = 0;

  function buildArcs(n, depth, a0, a1, parentAsn) {
    if (depth > maxDepth) maxDepth = depth;
    arcs.push({ asn: n.asn, name: n.name, depth: depth, cnt: n.cnt,
                val: n.val, a0: a0, a1: a1, parentAsn: parentAsn });
    // Sort children largest-first so big arcs appear in consistent positions
    var ks = Object.keys(n.ch);
    ks.sort(function (x, y) { return n.ch[y].val - n.ch[x].val; });
    var a = a0;
    ks.forEach(function (k) {
      var c    = n.ch[k];
      var span = (a1 - a0) * (c.val / n.val);
      buildArcs(c, depth + 1, a, a + span, n.asn);
      a += span;
    });
  }
  buildArcs(root, 0, 0, Math.PI * 2, null);


  // ═══════════════════════════════════════════════════════════════════════════
  // 5. COLOUR
  //    Hue follows the arc's angular midpoint (each direction gets its own
  //    colour family). Saturation and lightness decrease with depth so
  //    outer rings look progressively darker/cooler.
  // ═══════════════════════════════════════════════════════════════════════════

  function getColor(arc) {
    if (arc.depth === 0) return '#ff8800';
    var hue = ((arc.a0 + arc.a1) / 2 / (Math.PI * 2) * 360 + 180) % 360;
    var sat = Math.max(35, 75 - arc.depth * 7);
    var lit = Math.max(22, 58 - arc.depth * 5);
    return 'hsl(' + hue.toFixed(1) + ',' + sat + '%,' + lit + '%)';
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ZOOM STATE
  //    zoomArc is the arc that currently acts as the root of the view.
  //    At startup it is arcs[0] (the origin AS, full 2π view).
  //    Clicking an arc makes it the new zoom root; clicking the centre
  //    walks back up to the parent.
  // ═══════════════════════════════════════════════════════════════════════════

  var zoomArc = arcs[0];

  function getVisibleArcs() {
    var za = zoomArc;
    return arcs.filter(function (a) {
      if (a.depth < za.depth) return false;
      if (a.depth === za.depth) return a === za;
      var mid = (a.a0 + a.a1) / 2;
      return mid >= za.a0 && mid <= za.a1;
    });
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 7. OVERLAY DOM
  //    Full-screen fixed overlay: canvas + close button + tooltip div.
  //    The canvas uses devicePixelRatio so text and arcs are crisp on
  //    HiDPI / Retina displays.
  // ═══════════════════════════════════════════════════════════════════════════

  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
                     'background:#0d1117;z-index:999999;overflow:hidden;';

  var btn = document.createElement('button');
  btn.textContent = '✕';
  btn.style.cssText = 'position:absolute;top:10px;right:14px;background:#222;color:#aaa;' +
                      'border:1px solid #555;padding:4px 10px;cursor:pointer;border-radius:4px;' +
                      'font-size:15px;z-index:1000000;font-family:monospace;';
  btn.onclick = function () { ov.remove(); window.removeEventListener('resize', resize); };

  var tip = document.createElement('div');
  tip.style.cssText = 'position:fixed;background:#111827;color:#eee;padding:8px 12px;' +
                      'border-radius:5px;font-size:11px;pointer-events:none;display:none;' +
                      'z-index:1000001;border:1px solid #4ade80;font-family:monospace;' +
                      'max-width:340px;line-height:1.6;white-space:pre-wrap;';

  var cv = document.createElement('canvas');
  cv.style.cssText = 'display:block;cursor:pointer;';

  ov.appendChild(cv); ov.appendChild(btn); ov.appendChild(tip);
  document.body.appendChild(ov);


  // ═══════════════════════════════════════════════════════════════════════════
  // 8. LAYOUT HELPERS
  //    getParams()    — compute layout constants for the current zoom/window
  //    arcScreen()    — map an arc's logical angles to canvas screen angles
  //
  //    All coordinates returned by getParams are in logical CSS pixels.
  //    The canvas bitmap is larger by devicePixelRatio; a global scale()
  //    call at the start of draw() maps logical → physical automatically.
  // ═══════════════════════════════════════════════════════════════════════════

  function getParams() {
    var dpr = window.devicePixelRatio || 1;
    var W   = cv.width  / dpr;   // logical width
    var H   = cv.height / dpr;   // logical height
    var za  = zoomArc;
    var R   = Math.min(W, H) * 0.49;                        // outer radius
    var visDepths = maxDepth - za.depth + 1;
    var ringW     = R / Math.max(visDepths, 2);              // radial ring thickness
    // When zoomed in, expand the selected arc's angular span to fill 2π
    var aScale = (za === arcs[0]) ? 1 : (Math.PI * 2 / (za.a1 - za.a0));
    return { W: W, H: H, cx: W / 2, cy: H / 2,
             R: R, ringW: ringW, aScale: aScale,
             aOff: za.a0, baseDepth: za.depth, dpr: dpr };
  }

  function arcScreen(arc, p) {
    var rel = arc.depth - p.baseDepth;
    var r0  = rel * p.ringW;
    var r1  = r0 + p.ringW - 1;
    // Apply angular zoom offset and rotate 90° CCW so 0 radians = top
    var a0  = (arc.a0 - p.aOff) * p.aScale - Math.PI / 2;
    var a1  = (arc.a1 - p.aOff) * p.aScale - Math.PI / 2;
    return { r0: r0, r1: r1, a0: a0, a1: a1 };
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 9. HIT TEST
  //    Convert mouse position to polar coordinates relative to canvas centre,
  //    then check each visible arc from outermost inward.
  //    Note: s.a0/s.a1 can go negative for arcs crossing the top of the
  //    circle, so we normalise the mouse angle by adding 2π if needed.
  // ═══════════════════════════════════════════════════════════════════════════

  function hitArc(mx, my) {
    var p    = getParams();
    var dx   = mx - p.cx, dy = my - p.cy;
    var dist = Math.hypot(dx, dy);
    var ang  = Math.atan2(dy, dx);
    var vis  = getVisibleArcs();
    for (var i = vis.length - 1; i >= 0; i--) {
      var a = vis[i];
      if (a.depth === zoomArc.depth) continue;
      var s = arcScreen(a, p);
      if (dist < s.r0 || dist > s.r1) continue;
      var an = ang;
      if (an < s.a0 - 0.001) an += Math.PI * 2;
      if (an >= s.a0 && an <= s.a1) return a;
    }
    return null;
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 10. TOOLTIP CONTENT
  //     Shows: AS number, org name, path count, depth, and BGP communities.
  //     Communities accumulated during parsing are stored in asnComms[asn].
  //     Decoded meanings (from <abbr title>) and raw tuples (from text nodes)
  //     are both shown, deduplicated, capped at 20 entries.
  // ═══════════════════════════════════════════════════════════════════════════

  function tipContent(arc) {
    var lines = ['AS' + arc.asn + ' — ' + arc.name,
                 'Paths: ' + arc.cnt + '  Depth: ' + arc.depth];
    var comms = asnComms[arc.asn];
    if (comms && comms.length) {
      lines.push('');
      lines.push('Communities:');
      var seen = {}, shown = [];
      comms.forEach(function (c) { if (!seen[c]) { seen[c] = 1; shown.push(c); } });
      shown.slice(0, 20).forEach(function (c) { lines.push('  ' + c); });
      if (shown.length > 20) lines.push('  …(' + (shown.length - 20) + ' more)');
    }
    return lines.join('\n');
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 11. EVENTS
  // ═══════════════════════════════════════════════════════════════════════════

  cv.addEventListener('mousemove', function (e) {
    var r   = cv.getBoundingClientRect();
    var hit = hitArc(e.clientX - r.left, e.clientY - r.top);
    if (hit) {
      tip.style.display = 'block';
      tip.textContent   = tipContent(hit);
      // Position tooltip, clamped to viewport so it never goes off-screen
      var tx = e.clientX + 16, ty = e.clientY - 8;
      var tw = tip.offsetWidth,  th = tip.offsetHeight;
      if (tx + tw > window.innerWidth  - 6) tx = e.clientX - tw - 16;
      if (ty + th > window.innerHeight - 6) ty = window.innerHeight - th - 6;
      if (tx < 6) tx = 6;
      if (ty < 6) ty = 6;
      tip.style.left = tx + 'px';
      tip.style.top  = ty + 'px';
    } else {
      tip.style.display = 'none';
    }
  });

  cv.addEventListener('mouseleave', function () { tip.style.display = 'none'; });

  cv.addEventListener('click', function (e) {
    var r  = cv.getBoundingClientRect();
    var mx = e.clientX - r.left, my = e.clientY - r.top;
    var p  = getParams();

    // Click centre circle → zoom out to parent
    if (Math.hypot(mx - p.cx, my - p.cy) < p.ringW) {
      if (zoomArc !== arcs[0]) {
        var za     = zoomArc;
        var parent = null;
        for (var i = 0; i < arcs.length; i++) {
          var a = arcs[i];
          if (a.asn === za.parentAsn && a.depth === za.depth - 1 &&
              a.a0 <= za.a0 + 0.0001 && a.a1 >= za.a1 - 0.0001) { parent = a; break; }
        }
        zoomArc = parent || arcs[0];
        draw();
      }
      return;
    }

    // Click arc → zoom in if it has children
    var hit = hitArc(mx, my);
    if (hit) {
      var hasKids = arcs.some(function (a) {
        var mid = (a.a0 + a.a1) / 2;
        return a.depth === hit.depth + 1 && mid > hit.a0 && mid < hit.a1;
      });
      if (hasKids) { zoomArc = hit; draw(); }
    }
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // 12. DRAW
  //     Renders all visible arcs onto the canvas.
  //
  //     HiDPI: canvas bitmap = logical × devicePixelRatio. We reset the
  //     transform, then call scale(dpr, dpr) once so all drawing calls
  //     use logical CSS pixel coordinates throughout.
  //
  //     Label strategy: draw AS number in every arc whose arc-length at
  //     mid-radius is ≥ 9px. Clip to the arc shape first so partially-
  //     fitting labels are cut cleanly rather than bleeding into neighbours.
  //     dA (angular span) is always computed from the original a0/a1 values
  //     (which are always positive), not from the screen-space s.a0/s.a1
  //     which can go negative for arcs crossing the top of the circle.
  // ═══════════════════════════════════════════════════════════════════════════

  function draw() {
    var p   = getParams();
    var ctx = cv.getContext('2d');

    // Reset to identity, then scale for HiDPI — one scale for the whole frame
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.scale(p.dpr, p.dpr);

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, p.W, p.H);
    ctx.save();
    ctx.translate(p.cx, p.cy);

    var vis  = getVisibleArcs();
    var FONT = 'monospace';

    vis.forEach(function (arc) {

      // ── Centre circle (zoom root) ────────────────────────────────────────
      if (arc.depth === zoomArc.depth) {
        var cr = p.ringW * 0.88;
        ctx.beginPath(); ctx.arc(0, 0, cr, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8800'; ctx.fill();
        ctx.strokeStyle = '#0d1117'; ctx.lineWidth = 1.5; ctx.stroke();
        var label = 'AS' + arc.asn;
        var fs = Math.min(16, Math.floor(cr * 1.8 / (label.length * 0.6)));
        if (fs >= 6) {
          ctx.fillStyle = '#0d1117';
          ctx.font = 'bold ' + fs + 'px ' + FONT;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, 0, 0);
        }
        return;
      }

      var s  = arcScreen(arc, p);
      // Angular span — use original arc angles (always positive 0..2π)
      var dA = (arc.a1 - arc.a0) * p.aScale;
      if (dA < 0.002) return;   // invisible sliver

      // ── Arc segment ──────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(0, 0, s.r1, s.a0, s.a1);
      ctx.arc(0, 0, s.r0, s.a1, s.a0, true);
      ctx.closePath();
      ctx.fillStyle   = getColor(arc);
      ctx.globalAlpha = 0.88; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = '#0d1117'; ctx.lineWidth = 0.7; ctx.stroke();

      // ── Label ────────────────────────────────────────────────────────────
      var label   = 'AS' + arc.asn;
      var midR    = (s.r0 + s.r1) / 2;
      var chordPx = midR * dA;    // arc length at mid-radius in pixels
      if (chordPx < 9) return;    // skip truly tiny slivers

      // Compute mid-angle from original values to avoid -π/2 wrap artefacts
      var midA = ((arc.a0 + arc.a1) / 2 - p.aOff) * p.aScale - Math.PI / 2;
      var lx   = Math.cos(midA) * midR;
      var ly   = Math.sin(midA) * midR;

      // Clip to arc bounds — partial labels are cut cleanly, not overdrawn
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, s.r1, s.a0, s.a1);
      ctx.arc(0, 0, s.r0, s.a1, s.a0, true);
      ctx.closePath();
      ctx.clip();

      ctx.translate(lx, ly);
      // Flip text on the left half so it reads outward (not upside-down)
      var rot = midA + (midA > Math.PI / 2 && midA < Math.PI * 1.5 ? Math.PI : 0);
      ctx.rotate(rot);
      ctx.fillStyle     = '#fff';
      ctx.font          = '8px ' + FONT;
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';
      ctx.globalAlpha   = 0.9;
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    // ── Title bar ────────────────────────────────────────────────────────────
    ctx.restore();   // undo translate(cx,cy); dpr scale remains active
    ctx.fillStyle = 'rgba(13,17,23,0.75)';
    ctx.fillRect(0, 0, p.W, 22);
    ctx.fillStyle = '#4ade80';
    ctx.font      = 'bold 11px ' + FONT;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('BGP AS-Path Sunburst  |  click arc = zoom in  |  click centre = zoom out  |  hover = details', 8, 5);
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 13. RESIZE
  //     Set the canvas bitmap size to physical pixels (logical × dpr) and
  //     set the CSS display size to logical pixels. This prevents blurring
  //     on HiDPI screens. draw() is called after every resize.
  // ═══════════════════════════════════════════════════════════════════════════

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    var lw  = window.innerWidth, lh = window.innerHeight;
    cv.width  = Math.round(lw * dpr);
    cv.height = Math.round(lh * dpr);
    cv.style.width  = lw + 'px';
    cv.style.height = lh + 'px';
    draw();
  }

  window.addEventListener('resize', resize);
  resize();

})();
