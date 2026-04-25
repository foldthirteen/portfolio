#!/usr/bin/env python3
"""Generate svc-flow.svg — a flow-field of smooth bezier streamlines with
connection nodes where streamlines pass near each other. Deterministic
(seeded) so re-runs produce identical output."""

import math
import random

random.seed(13)

W, H = 1200, 900
STEP = 18
MAX_STEPS = 140
N_LINES = 30

def angle_at(x, y):
    a = (math.sin(x * 0.0032) * 0.45
         + math.cos(y * 0.0041) * 0.35
         + math.sin((x + y) * 0.0019) * 0.25)
    return a + 0.55  # ~31° base diagonal bias

def trace(sx, sy):
    pts = [(sx, sy)]
    x, y = sx, sy
    for _ in range(MAX_STEPS):
        a = angle_at(x, y)
        x += math.cos(a) * STEP
        y += math.sin(a) * STEP
        if x > W + 60 or x < -120 or y > H + 60 or y < -120:
            break
        pts.append((x, y))
    return pts

streamlines = []
for i in range(N_LINES):
    if i < int(N_LINES * 0.55):
        sx = -40
        sy = random.uniform(-80, H * 1.05)
    else:
        sx = random.uniform(-40, W * 0.65)
        sy = -40
    pts = trace(sx, sy)
    if len(pts) > 8:
        width = random.uniform(0.55, 1.35)
        streamlines.append((pts, width))

# Smooth a polyline into quadratic-bezier path data using midpoint smoothing.
def smooth_d(pts):
    if len(pts) < 2:
        return ''
    if len(pts) == 2:
        return f'M{pts[0][0]:.1f} {pts[0][1]:.1f} L{pts[1][0]:.1f} {pts[1][1]:.1f}'
    out = [f'M{pts[0][0]:.1f} {pts[0][1]:.1f}']
    for i in range(1, len(pts) - 1):
        mx = (pts[i][0] + pts[i + 1][0]) / 2
        my = (pts[i][1] + pts[i + 1][1]) / 2
        out.append(f'Q{pts[i][0]:.1f} {pts[i][1]:.1f} {mx:.1f} {my:.1f}')
    out.append(f'T{pts[-1][0]:.1f} {pts[-1][1]:.1f}')
    return ' '.join(out)

# Connection nodes: where two streamlines pass close to each other.
nodes = []
MIN_NODE_DIST_SQ = 2200  # ~47 units between any two nodes
PROX_SQ = 230  # ~15 units between two streamline points to count as "close"

for i, (a_pts, _) in enumerate(streamlines):
    for j in range(i + 1, len(streamlines)):
        b_pts = streamlines[j][0]
        for ai in range(0, len(a_pts), 4):
            ax, ay = a_pts[ai]
            for bi in range(0, len(b_pts), 4):
                bx, by = b_pts[bi]
                d = (ax - bx) ** 2 + (ay - by) ** 2
                if d < PROX_SQ:
                    cx, cy = (ax + bx) / 2, (ay + by) / 2
                    if all((cx - nx) ** 2 + (cy - ny) ** 2 > MIN_NODE_DIST_SQ
                           for nx, ny, _ in nodes):
                        nodes.append((cx, cy, random.uniform(1.6, 2.5)))
                    break

# A few endpoint pips for character.
for pts, _ in streamlines:
    if random.random() < 0.25 and len(pts) > 2:
        ex, ey = pts[-1]
        if 30 < ex < W - 30 and 30 < ey < H - 30:
            if all((ex - nx) ** 2 + (ey - ny) ** 2 > MIN_NODE_DIST_SQ
                   for nx, ny, _ in nodes):
                nodes.append((ex, ey, random.uniform(1.2, 1.9)))

out = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
    f'preserveAspectRatio="xMidYMid slice">',
    '<g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">',
]
for pts, width in streamlines:
    out.append(f'<path d="{smooth_d(pts)}" stroke-width="{width:.2f}"/>')
out.append('</g>')

out.append('<g fill="#fff">')
for nx, ny, r in nodes:
    out.append(f'<circle cx="{nx:.1f}" cy="{ny:.1f}" r="{r:.2f}"/>')
out.append('</g>')

out.append('</svg>')

svg = '\n'.join(out)
with open('/Users/ben/portfolio/assets/images/svc-flow.svg', 'w') as f:
    f.write(svg)

print(f'wrote svc-flow.svg ({len(svg)} bytes, {len(streamlines)} lines, {len(nodes)} nodes)')
