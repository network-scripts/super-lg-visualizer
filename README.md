# BGP AS-Path Sunburst

A zero-dependency Firefox **bookmarklet** that visualises BGP AS-path data from [bgp.tools/super-lg](https://bgp.tools/super-lg) as an interactive zoomable sunburst chart, rendered on an HTML5 Canvas.

![BGP Sunburst screenshot](screenshot.svg)

---

## Installation

1. Open `install.html` (or the page linked below) in Firefox
2. Make sure your bookmarks bar is visible — `View → Toolbars → Bookmarks Toolbar`
3. **Drag the button below onto your bookmarks bar:**

<p align="center">
  <a href="javascript:%21function%28%29%7Bfor%28var%20e%2Ct%3D%5B%5D%2Cn%3D%7B%7D%2Ca%3D%7B%7D%2Cr%3Dnull%2Ci%3D%5B%5D%2Cl%3D%211%2Co%3D%5B%5D%2Cc%3Ddocument.createTreeWalker%28document.body%2CNodeFilter.SHOW_ALL%29%3Be%3Dc.nextNode%28%29%3B%29if%283%3D%3D%3De.nodeType%29%7Bvar%20h%3De.textContent%3Bif%28h.indexOf%28%22BGP.as_path%3A%22%29%3E%3D0%29r%3D%5B%5D%2Co%3D%5B%5D%2Ci%3D%5B%5D%2Cl%3D%211%2Ct.push%28r%29%3Belse%20if%28h.indexOf%28%22BGP.community%3A%22%29%3E%3D0%7C%7Ch.indexOf%28%22BGP.large_community%3A%22%29%3E%3D0%29%7Bl%3D%210%3Bfor%28var%20s%2Cf%3Dh.replace%28%2FBGP%5C.%28large_%29%3Fcommunity%3A%2Fg%2C%22%22%29%2Cd%3D%2F%5C%28%5Cs%2A%5B%5Cd%2C%5Cs%5D%2B%5C%29%2Fg%3Bnull%21%3D%3D%28s%3Dd.exec%28f%29%29%3B%29i.push%28s%5B0%5D.replace%28%2F%5Cs%2B%2Fg%2C%22%22%29%29%7Delse%20if%28l%26%26h.trim%28%29.length%3E0%26%26h.indexOf%28%22BGP.%22%29%3E%3D0%29l%3D%211%2Co.length%26%26i.length%26%26o.forEach%28function%28e%29%7Ba%5Be%5D%7C%7C%28a%5Be%5D%3D%5B%5D%29%2Ci.forEach%28function%28t%29%7Ba%5Be%5D.indexOf%28t%29%3C0%26%26a%5Be%5D.push%28t%29%7D%29%7D%29%3Belse%20if%28l%29for%28var%20p%2Cu%3D%2F%5C%28%5Cs%2A%5B%5Cd%2C%5Cs%5D%2B%5C%29%2Fg%3Bnull%21%3D%3D%28p%3Du.exec%28h%29%29%3B%29i.push%28p%5B0%5D.replace%28%2F%5Cs%2B%2Fg%2C%22%22%29%29%7Delse%20if%281%3D%3D%3De.nodeType%26%26%22ABBR%22%3D%3D%3De.tagName%29%7Bvar%20v%3De.textContent.trim%28%29%2Cx%3De.getAttribute%28%22title%22%29%7C%7C%22%22%3Bif%28%2F%5E%5Cd%2B%24%2F.test%28v%29%26%26null%21%3D%3Dr%26%26%21l%29n%5Bv%5D%3Dx%7C%7C%22AS%22%2Bv%2Cr.length%26%26r%5Br.length-1%5D%3D%3D%3Dv%7C%7C%28r.push%28v%29%2Co.push%28v%29%29%3Belse%20if%28l%29%7Bvar%20g%3De.textContent.trim%28%29%3Bg%26%26i.push%28g%29%2Cx%26%26i.push%28x%29%7D%7Dif%28o.length%26%26i.length%26%26o.forEach%28function%28e%29%7Ba%5Be%5D%7C%7C%28a%5Be%5D%3D%5B%5D%29%2Ci.forEach%28function%28t%29%7Ba%5Be%5D.indexOf%28t%29%3C0%26%26a%5Be%5D.push%28t%29%7D%29%7D%29%2C%28t%3Dt.filter%28function%28e%29%7Breturn%20e.length%3E%3D2%7D%29%29.length%29%7Bvar%20m%3D%7B%7D%3Bt.forEach%28function%28e%29%7Bvar%20t%3De%5Be.length-1%5D%3Bm%5Bt%5D%3D%28m%5Bt%5D%7C%7C0%29%2B1%7D%29%3Bvar%20y%3DObject.keys%28m%29.sort%28function%28e%2Ct%29%7Breturn%20m%5Bt%5D-m%5Be%5D%7D%29%5B0%5D%2Cb%3DB%28y%29%3Bt.forEach%28function%28e%29%7Bvar%20t%3De.slice%28%29.reverse%28%29%2Cn%3Dt.indexOf%28y%29%3Bn%3C0%26%26%28n%3D0%29%3Bvar%20a%3Db%3Bb.cnt%2B%2B%3Bfor%28var%20r%3Dn%2B1%3Br%3Ct.length%3Br%2B%2B%29%7Bvar%20i%3Dt%5Br%5D%3Ba.ch%5Bi%5D%7C%7C%28a.ch%5Bi%5D%3DB%28i%29%29%2C%28a%3Da.ch%5Bi%5D%29.cnt%2B%2B%7D%7D%29%2Cfunction%20e%28t%29%7Bvar%20n%3DObject.keys%28t.ch%29%3Bn.length%3F%28t.val%3D0%2Cn.forEach%28function%28n%29%7Be%28t.ch%5Bn%5D%29%2Ct.val%2B%3Dt.ch%5Bn%5D.val%7D%29%29%3At.val%3Dt.cnt%7D%28b%29%3Bvar%20P%3D%5B%5D%2CM%3D0%3B%21function%20e%28t%2Cn%2Ca%2Cr%2Ci%29%7Bn%3EM%26%26%28M%3Dn%29%2CP.push%28%7Basn%3At.asn%2Cname%3At.name%2Cdepth%3An%2Ccnt%3At.cnt%2Cval%3At.val%2Ca0%3Aa%2Ca1%3Ar%2CparentAsn%3Ai%7D%29%3Bvar%20l%3DObject.keys%28t.ch%29%3Bl.sort%28function%28e%2Cn%29%7Breturn%20t.ch%5Bn%5D.val-t.ch%5Be%5D.val%7D%29%3Bvar%20o%3Da%3Bl.forEach%28function%28i%29%7Bvar%20l%3Dt.ch%5Bi%5D%2Cc%3D%28r-a%29%2A%28l.val%2Ft.val%29%3Be%28l%2Cn%2B1%2Co%2Co%2Bc%2Ct.asn%29%2Co%2B%3Dc%7D%29%7D%28b%2C0%2C0%2C2%2AMath.PI%2Cnull%29%3Bvar%20S%3DP%5B0%5D%2CE%3Ddocument.createElement%28%22div%22%29%3BE.style.cssText%3D%22position%3Afixed%3Btop%3A0%3Bleft%3A0%3Bwidth%3A100vw%3Bheight%3A100vh%3Bbackground%3A%230d1117%3Bz-index%3A999999%3Boverflow%3Ahidden%3B%22%3Bvar%20A%3Ddocument.createElement%28%22button%22%29%3BA.textContent%3D%22%E2%9C%95%22%2CA.style.cssText%3D%22position%3Aabsolute%3Btop%3A10px%3Bright%3A14px%3Bbackground%3A%23222%3Bcolor%3A%23aaa%3Bborder%3A1px%20solid%20%23555%3Bpadding%3A4px%2010px%3Bcursor%3Apointer%3Bborder-radius%3A4px%3Bfont-size%3A15px%3Bz-index%3A1000000%3Bfont-family%3Amonospace%3B%22%2CA.onclick%3Dfunction%28%29%7BE.remove%28%29%2Cwindow.removeEventListener%28%22resize%22%2Cz%29%7D%3Bvar%20k%3Ddocument.createElement%28%22div%22%29%3Bk.style.cssText%3D%22position%3Afixed%3Bbackground%3A%23111827%3Bcolor%3A%23eee%3Bpadding%3A8px%2012px%3Bborder-radius%3A5px%3Bfont-size%3A11px%3Bpointer-events%3Anone%3Bdisplay%3Anone%3Bz-index%3A1000001%3Bborder%3A1px%20solid%20%234ade80%3Bfont-family%3Amonospace%3Bmax-width%3A340px%3Bline-height%3A1.6%3Bwhite-space%3Apre-wrap%3B%22%3Bvar%20w%3Ddocument.createElement%28%22canvas%22%29%3Bw.style.cssText%3D%22display%3Ablock%3Bcursor%3Apointer%3B%22%2CE.appendChild%28w%29%2CE.appendChild%28A%29%2CE.appendChild%28k%29%2Cdocument.body.appendChild%28E%29%2Cw.addEventListener%28%22mousemove%22%2Cfunction%28e%29%7Bvar%20t%3Dw.getBoundingClientRect%28%29%2Cn%3DI%28e.clientX-t.left%2Ce.clientY-t.top%29%3Bn%3F%28k.style.display%3D%22block%22%2Ck.style.left%3De.clientX%2B16%2B%22px%22%2Ck.style.top%3De.clientY-8%2B%22px%22%2Ck.textContent%3Dfunction%28e%29%7Bvar%20t%3D%5B%22AS%22%2Be.asn%2B%22%20%E2%80%94%20%22%2Be.name%2C%22Paths%3A%20%22%2Be.cnt%2B%22%20%20Depth%3A%20%22%2Be.depth%5D%2Cn%3Da%5Be.asn%5D%3Bif%28n%26%26n.length%29%7Bt.push%28%22%22%29%2Ct.push%28%22Communities%3A%22%29%3Bvar%20r%3D%7B%7D%2Ci%3D%5B%5D%3Bn.forEach%28function%28e%29%7Br%5Be%5D%7C%7C%28r%5Be%5D%3D1%2Ci.push%28e%29%29%7D%29%2Ci.slice%280%2C20%29.forEach%28function%28e%29%7Bt.push%28%22%20%20%22%2Be%29%7D%29%2Ci.length%3E20%26%26t.push%28%22%20%20%E2%80%A6%28%22%2B%28i.length-20%29%2B%22%20more%29%22%29%7Dreturn%20t.join%28%22%5Cn%22%29%7D%28n%29%29%3Ak.style.display%3D%22none%22%7D%29%2Cw.addEventListener%28%22mouseleave%22%2Cfunction%28%29%7Bk.style.display%3D%22none%22%7D%29%2Cw.addEventListener%28%22click%22%2Cfunction%28e%29%7Bvar%20t%3Dw.getBoundingClientRect%28%29%2Cn%3De.clientX-t.left%2Ca%3De.clientY-t.top%2Cr%3DW%28%29%3Bif%28Math.hypot%28n-r.cx%2Ca-r.cy%29%3Cr.ringW%29%7Bif%28S%21%3D%3DP%5B0%5D%29%7Bfor%28var%20i%3DS%2Cl%3Dnull%2Co%3D0%3Bo%3CP.length%3Bo%2B%2B%29%7Bvar%20c%3DP%5Bo%5D%3Bif%28c.asn%3D%3D%3Di.parentAsn%26%26c.depth%3D%3D%3Di.depth-1%26%26c.a0%3C%3Di.a0%2B1e-4%26%26c.a1%3E%3Di.a1-1e-4%29%7Bl%3Dc%3Bbreak%7D%7DS%3Dl%7C%7CP%5B0%5D%2CT%28%29%7D%7Delse%7Bvar%20h%3DI%28n%2Ca%29%3Bif%28h%29%7Bvar%20s%3DP.some%28function%28e%29%7Bvar%20t%3D%28e.a0%2Be.a1%29%2F2%3Breturn%20e.depth%3D%3D%3Dh.depth%2B1%26%26t%3Eh.a0%26%26t%3Ch.a1%7D%29%3Bs%26%26%28S%3Dh%2CT%28%29%29%7D%7D%7D%29%2Cwindow.addEventListener%28%22resize%22%2Cz%29%2Cz%28%29%7Delse%20alert%28%22No%20BGP%20AS%20paths%20found%20on%20this%20page.%22%29%3Bfunction%20B%28e%29%7Breturn%7Basn%3Ae%2Cname%3An%5Be%5D%7C%7C%22AS%22%2Be%2Cch%3A%7B%7D%2Ccnt%3A0%2Cval%3A0%2CparentAsn%3Anull%7D%7Dfunction%20O%28%29%7Bvar%20e%3DS%3Breturn%20P.filter%28function%28t%29%7Bif%28t.depth%3Ce.depth%29return%211%3Bif%28t.depth%3D%3D%3De.depth%29return%20t%3D%3D%3De%3Bvar%20n%3D%28t.a0%2Bt.a1%29%2F2%3Breturn%20n%3E%3De.a0%26%26n%3C%3De.a1%7D%29%7Dfunction%20W%28%29%7Bvar%20e%3Dw.width%2Ct%3Dw.height%2Cn%3DS%2Ca%3D.49%2AMath.min%28e%2Ct%29%2Cr%3DM-n.depth%2B1%3Breturn%7BW%3Ae%2CH%3At%2Ccx%3Ae%2F2%2Ccy%3At%2F2%2CR%3Aa%2CringW%3Aa%2FMath.max%28r%2C2%29%2CaScale%3An%3D%3D%3DP%5B0%5D%3F1%3A2%2AMath.PI%2F%28n.a1-n.a0%29%2CaOff%3An.a0%2CbaseDepth%3An.depth%7D%7Dfunction%20C%28e%2Ct%29%7Bvar%20n%3D%28e.depth-t.baseDepth%29%2At.ringW%3Breturn%7Br0%3An%2Cr1%3An%2Bt.ringW-1%2Ca0%3A%28e.a0-t.aOff%29%2At.aScale-Math.PI%2F2%2Ca1%3A%28e.a1-t.aOff%29%2At.aScale-Math.PI%2F2%7D%7Dfunction%20I%28e%2Ct%29%7Bfor%28var%20n%3DW%28%29%2Ca%3De-n.cx%2Cr%3Dt-n.cy%2Ci%3DMath.hypot%28a%2Cr%29%2Cl%3DMath.atan2%28r%2Ca%29%2Co%3DO%28%29%2Cc%3Do.length-1%3Bc%3E%3D0%3Bc--%29%7Bvar%20h%3Do%5Bc%5D%3Bif%28h.depth%21%3D%3DS.depth%29%7Bvar%20s%3DC%28h%2Cn%29%3Bif%28%21%28i%3Cs.r0%7C%7Ci%3Es.r1%29%29%7Bvar%20f%3Dl%3Bif%28f%3Cs.a0-.001%26%26%28f%2B%3D2%2AMath.PI%29%2Cf%3E%3Ds.a0%26%26f%3C%3Ds.a1%29return%20h%7D%7D%7Dreturn%20null%7Dfunction%20T%28%29%7Bvar%20e%3DW%28%29%2Ct%3Dw.getContext%28%222d%22%29%3Bt.clearRect%280%2C0%2Ce.W%2Ce.H%29%2Ct.fillStyle%3D%22%230d1117%22%2Ct.fillRect%280%2C0%2Ce.W%2Ce.H%29%2Ct.save%28%29%2Ct.translate%28e.cx%2Ce.cy%29%3Bvar%20n%3DO%28%29%2Ca%3D%22monospace%22%3Bn.forEach%28function%28n%29%7Bif%28n.depth%21%3D%3DS.depth%29%7Bvar%20r%3DC%28n%2Ce%29%2Ci%3Dr.a1-r.a0%3Bif%28%21%28i%3C.002%29%29%7Bt.beginPath%28%29%2Ct.arc%280%2C0%2Cr.r1%2Cr.a0%2Cr.a1%29%2Ct.arc%280%2C0%2Cr.r0%2Cr.a1%2Cr.a0%2C%210%29%2Ct.closePath%28%29%2Ct.fillStyle%3Dfunction%28e%29%7Breturn%200%3D%3D%3De.depth%3F%22%23ff8800%22%3A%22hsl%28%22%2B%28%28%28e.a0%2Be.a1%29%2F2%2F%282%2AMath.PI%29%2A360%2B180%29%25360%29.toFixed%281%29%2B%22%2C%22%2BMath.max%2835%2C75-7%2Ae.depth%29%2B%22%25%2C%22%2BMath.max%2822%2C58-5%2Ae.depth%29%2B%22%25%29%22%7D%28n%29%2Ct.globalAlpha%3D.88%2Ct.fill%28%29%2Ct.globalAlpha%3D1%2Ct.strokeStyle%3D%22%230d1117%22%2Ct.lineWidth%3D.7%2Ct.stroke%28%29%3Bd%3D%22AS%22%2Bn.asn%3Bvar%20l%3D%28r.r0%2Br.r1%29%2F2%3Bif%28%21%28l%2Ai%3C4.8%2Ad.length%29%29%7Bvar%20o%3D%28r.a0%2Br.a1%29%2F2%2Cc%3DMath.cos%28o%29%2Al%2Ch%3DMath.sin%28o%29%2Al%3Bt.save%28%29%2Ct.translate%28c%2Ch%29%3Bvar%20s%3Do%2B%28o%3EMath.PI%2F2%26%26o%3C1.5%2AMath.PI%3FMath.PI%3A0%29%3Bt.rotate%28s%29%2Ct.fillStyle%3D%22%23fff%22%2Ct.font%3D%228px%20%22%2Ba%2Ct.textAlign%3D%22center%22%2Ct.textBaseline%3D%22middle%22%2Ct.globalAlpha%3D.9%2Ct.fillText%28d%2C0%2C0%29%2Ct.restore%28%29%7D%7D%7Delse%7Bvar%20f%3D.88%2Ae.ringW%3Bt.beginPath%28%29%2Ct.arc%280%2C0%2Cf%2C0%2C2%2AMath.PI%29%2Ct.fillStyle%3D%22%23ff8800%22%2Ct.fill%28%29%2Ct.strokeStyle%3D%22%230d1117%22%2Ct.lineWidth%3D1.5%2Ct.stroke%28%29%3Bvar%20d%3D%22AS%22%2Bn.asn%2Cp%3DMath.min%2816%2CMath.floor%281.8%2Af%2F%28.6%2Ad.length%29%29%29%3Bp%3E%3D6%26%26%28t.fillStyle%3D%22%230d1117%22%2Ct.font%3D%22bold%20%22%2Bp%2B%22px%20%22%2Ba%2Ct.textAlign%3D%22center%22%2Ct.textBaseline%3D%22middle%22%2Ct.fillText%28d%2C0%2C0%29%29%7D%7D%29%2Ct.restore%28%29%2Ct.fillStyle%3D%22rgba%2813%2C17%2C23%2C0.75%29%22%2Ct.fillRect%280%2C0%2Ce.W%2C22%29%2Ct.fillStyle%3D%22%234ade80%22%2Ct.font%3D%22bold%2011px%20monospace%22%2Ct.textAlign%3D%22left%22%2Ct.textBaseline%3D%22top%22%2Ct.fillText%28%22BGP%20AS-Path%20Sunburst%20%20%7C%20%20click%20arc%20%3D%20zoom%20in%20%20%7C%20%20click%20centre%20%3D%20zoom%20out%20%20%7C%20%20hover%20%3D%20details%22%2C8%2C5%29%7Dfunction%20z%28%29%7Bw.width%3Dwindow.innerWidth%2Cw.height%3Dwindow.innerHeight%2CT%28%29%7D%7D%28%29%3B" title="Drag this to your bookmarks bar">
    <img alt="☀️ BGP Sunburst" src="https://img.shields.io/badge/%E2%98%80%EF%B8%8F_BGP_Sunburst-drag_to_bookmarks-14532d?style=for-the-badge&labelColor=0d1117&color=16a34a">
  </a>
</p>

> **Note:** GitHub strips `javascript:` links for security. Use `install.html` (included in this repo) to get the real drag-and-drop button.

---

## Usage

1. Go to [bgp.tools/super-lg](https://bgp.tools/super-lg) and search for any prefix (e.g. `195.113.0.0/16`)
2. Click the **BGP Sunburst** bookmark
3. A full-screen overlay appears immediately — no network requests, no loading

| Interaction | Action |
|---|---|
| **Click arc** | Zoom into that subtree |
| **Click centre** | Zoom out one level |
| **Hover** | Tooltip: org name · path count · BGP communities |
| **✕ button** | Close overlay |

---

## How it works

```
Collector peer → … → transit AS → … → origin AS (centre)
```

The chart is rooted at the **origin AS** (the AS that announces the searched prefix). Each concentric ring represents one more transit hop outward toward the collecting peers. Arc width is proportional to the number of observed paths flowing through that segment.

### Data pipeline

```
DOM walk (TreeWalker)
  │
  ├─ BGP.as_path: <abbr title="Org">ASN</abbr> …   → path array + org names
  ├─ BGP.community: (x,y) <abbr>[decoded]</abbr>   → community strings per ASN
  └─ BGP.large_community: <abbr>[decoded]</abbr>   → large community strings
        │
        ▼
  Deduplicate consecutive ASNs (collapse prepend padding)
        │
        ▼
  Build trie (origin → transit → collector)
        │
        ▼
  Assign arc angles proportional to path count
        │
        ▼
  Render on HiDPI-aware Canvas 2D
```

### Key implementation notes

- **Self-contained** — no external libraries, no network requests after page load
- **HiDPI rendering** — canvas bitmap sized at `logical × devicePixelRatio`; all draw calls use logical CSS pixels via a single `ctx.scale(dpr, dpr)`
- **Label clipping** — each label is clipped to its arc segment, so partially-fitting text is cut cleanly
- **Angle wrap fix** — arc span `dA` and midpoint `midA` are computed from the original `[0, 2π]` angles, not the screen-space angles that can go negative for arcs crossing the top of the circle
- **Community flush timing** — communities are flushed to the previous record at the *start* of each new `BGP.as_path:` record, because the DOM text node that ends a community block and starts the next path header is a single combined text node

---

## Files

| File | Description |
|---|---|
| `bgp_sunburst.js` | Full source with comments — the canonical version |
| `install.html` | Open in Firefox to get the drag-and-drop bookmarklet button |
| `screenshot.svg` | Preview image |

---

## Tested on

- Firefox 124+ on Linux, Windows, macOS
- bgp.tools/super-lg (April 2026 DOM structure)

---

## License

MIT
