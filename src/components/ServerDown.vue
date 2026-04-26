<template>
  <div class="server-down">
    <canvas ref="canvas" class="gears-canvas"></canvas>

    <div class="content">
      <div class="left">
        <h1>Uh-oh!<br />Our server is in therapy mode!</h1>
        <p class="sub">Sometimes even computers feel a little overwhelmed. It's<br />currently lying on the couch, talking about its feelings.</p>

        <div class="what">
          <p>What can you do?</p>
          <ol>
            <li>Refresh the page - it just needs a moment to process.</li>
            <li>Let us know about the issue.</li>
            <li>Explore another page - there's still plenty to see here.</li>
          </ol>
        </div>

        <div class="actions">
          <button @click="$router.back()" class="btn-back">Go back</button>
          <button @click="retry" class="btn-contact">Try again</button>
        </div>
      </div>

      <div class="right">
        <div class="bubble">
          <span class="code">500</span>
          <span class="label">INTERNAL SERVER<br /><strong>ERROR</strong></span>
        </div>
        <svg class="robot-scene" viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Couch -->
          <rect x="60" y="220" width="260" height="18" rx="9" fill="#7aab8a"/>
          <rect x="50" y="200" width="20" height="40" rx="8" fill="#5d9070"/>
          <rect x="310" y="200" width="20" height="40" rx="8" fill="#5d9070"/>
          <rect x="55" y="195" width="270" height="30" rx="10" fill="#8bbf9a"/>

          <!-- Robot body lying down -->
          <rect x="100" y="165" width="80" height="55" rx="12" fill="#d4d8e0"/>
          <rect x="108" y="173" width="64" height="38" rx="8" fill="#b0b8c8"/>
          <!-- Robot face -->
          <rect x="115" y="178" width="50" height="28" rx="6" fill="#c8cdd8"/>
          <circle cx="128" cy="190" r="5" fill="#fff"/>
          <circle cx="152" cy="190" r="5" fill="#fff"/>
          <circle cx="129" cy="191" r="2.5" fill="#555"/>
          <circle cx="153" cy="191" r="2.5" fill="#555"/>
          <!-- Sad mouth -->
          <path d="M132 202 Q140 198 148 202" stroke="#888" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Antenna -->
          <line x1="140" y1="165" x2="140" y2="150" stroke="#aaa" stroke-width="2.5"/>
          <circle cx="140" cy="147" r="4" fill="#e07070"/>
          <!-- Robot legs -->
          <rect x="95" y="215" width="22" height="12" rx="5" fill="#c0c5d0"/>
          <rect x="163" y="215" width="22" height="12" rx="5" fill="#c0c5d0"/>
          <!-- Robot arm hanging -->
          <rect x="82" y="175" width="18" height="10" rx="5" fill="#c0c5d0"/>
          <!-- Chest bolt -->
          <circle cx="140" cy="192" r="3" fill="#8899bb"/>

          <!-- Therapist (person) -->
          <!-- Body -->
          <rect x="290" y="175" width="38" height="60" rx="10" fill="#e8d5c0"/>
          <!-- Head -->
          <circle cx="309" cy="162" r="20" fill="#f5e6d0"/>
          <!-- Hair -->
          <path d="M289 158 Q309 138 329 158" fill="#3a2a1a"/>
          <rect x="289" y="155" width="8" height="15" rx="4" fill="#3a2a1a"/>
          <!-- Glasses -->
          <circle cx="302" cy="162" r="6" stroke="#555" stroke-width="1.5" fill="none"/>
          <circle cx="316" cy="162" r="6" stroke="#555" stroke-width="1.5" fill="none"/>
          <line x1="308" y1="162" x2="310" y2="162" stroke="#555" stroke-width="1.5"/>
          <!-- Clipboard -->
          <rect x="325" y="185" width="28" height="36" rx="4" fill="#e07070"/>
          <rect x="329" y="190" width="20" height="3" rx="1" fill="#fff" opacity="0.6"/>
          <rect x="329" y="196" width="16" height="3" rx="1" fill="#fff" opacity="0.6"/>
          <rect x="329" y="202" width="18" height="3" rx="1" fill="#fff" opacity="0.6"/>
          <!-- Arm holding clipboard -->
          <rect x="318" y="190" width="12" height="8" rx="4" fill="#e8d5c0"/>
          <!-- Legs -->
          <rect x="293" y="232" width="14" height="30" rx="6" fill="#4a6fa5"/>
          <rect x="311" y="232" width="14" height="30" rx="6" fill="#4a6fa5"/>
          <!-- Shoes -->
          <ellipse cx="300" cy="263" rx="10" ry="5" fill="#c0392b"/>
          <ellipse cx="318" cy="263" rx="10" ry="5" fill="#c0392b"/>

          <!-- Swirl thought bubbles near robot -->
          <circle cx="210" cy="155" r="12" stroke="#c8cdd8" stroke-width="1.5" fill="none" opacity="0.6"/>
          <circle cx="228" cy="140" r="8" stroke="#c8cdd8" stroke-width="1.5" fill="none" opacity="0.5"/>
          <circle cx="240" cy="130" r="5" stroke="#c8cdd8" stroke-width="1.5" fill="none" opacity="0.4"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const emit = defineEmits(['retry'])
const canvas = ref(null)
const store = useTaskStore()
let animId = null

function retry() {
  store.loadTasks()
  emit('retry')
}

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')

  function resize() {
    c.width = c.offsetWidth
    c.height = c.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const gears = [
    { x: 0.08, y: 0.15, r: 38, teeth: 10, speed: 0.008,  angle: 0, color: '#c8cdd8' },
    { x: 0.82, y: 0.08, r: 28, teeth: 8,  speed: -0.012, angle: 0, color: '#b0b8c8' },
    { x: 0.65, y: 0.82, r: 34, teeth: 9,  speed: 0.010,  angle: 0, color: '#7aab8a' },
    { x: 0.15, y: 0.78, r: 22, teeth: 7,  speed: -0.015, angle: 0, color: '#c8cdd8' },
  ]

  function drawGear(ctx, x, y, r, teeth, angle, color) {
    const toothH = r * 0.28
    const toothW = (2 * Math.PI) / teeth
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.beginPath()
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2
      const a1 = a - toothW * 0.3
      const a2 = a - toothW * 0.1
      const a3 = a + toothW * 0.1
      const a4 = a + toothW * 0.3
      ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r)
      ctx.lineTo(Math.cos(a2) * (r + toothH), Math.sin(a2) * (r + toothH))
      ctx.lineTo(Math.cos(a3) * (r + toothH), Math.sin(a3) * (r + toothH))
      ctx.lineTo(Math.cos(a4) * r, Math.sin(a4) * r)
    }
    ctx.closePath()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.25
    ctx.fill()
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.globalAlpha = 0.18
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.restore()
  }

  function loop() {
    ctx.clearRect(0, 0, c.width, c.height)
    gears.forEach(g => {
      g.angle += g.speed
      drawGear(ctx, g.x * c.width, g.y * c.height, g.r, g.teeth, g.angle, g.color)
    })
    animId = requestAnimationFrame(loop)
  }
  loop()

  onBeforeUnmount(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<style scoped>
.server-down {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 480px;
  background: #f0ede8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}

.gears-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 40px;
  max-width: 900px;
  width: 100%;
}

.left {
  flex: 1;
  min-width: 0;
}

.left h1 {
  font-size: 28px;
  font-weight: 700;
  color: #2d2d2d;
  line-height: 1.3;
  margin-bottom: 14px;
}

.sub {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.what p {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
}

.what ol {
  padding-left: 18px;
  font-size: 13px;
  color: #555;
  line-height: 2;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-back {
  padding: 9px 22px;
  border-radius: 8px;
  border: 1.5px solid #aaa;
  background: #f0ede8;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-back:hover { background: #e0ddd8; }

.btn-contact {
  padding: 9px 22px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-contact:hover { background: #e8e5e0; }

.right {
  position: relative;
  flex-shrink: 0;
}

.bubble {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #f0ede8;
  border: 2px solid #c8cdd8;
  border-radius: 50% 50% 50% 10px;
  padding: 12px 18px;
  text-align: center;
  z-index: 2;
}

.bubble .code {
  display: block;
  font-size: 42px;
  font-weight: 800;
  color: #8899bb;
  line-height: 1;
}

.bubble .label {
  display: block;
  font-size: 10px;
  color: #8899bb;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

.robot-scene {
  width: 380px;
  height: auto;
}

@media (max-width: 700px) {
  .content { flex-direction: column; padding: 24px; }
  .right { display: none; }
  .left h1 { font-size: 22px; }
}
</style>
