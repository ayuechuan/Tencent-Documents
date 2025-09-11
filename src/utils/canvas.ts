// cinema-seat.ts — 全功能 Canvas 电影院选票系统 + 拖动缩放支持 + Tooltip

interface Seat {
  row: number;
  col: number;
  label: string;
  status: 'available' | 'selected' | 'sold';
  zone: 'VIP' | 'Standard';
}

type SeatMap = Seat[][];

const canvas = document.getElementById('seatCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const dpr = window.devicePixelRatio || 1;

// 配置
const PADDING = 6;
const FONT_SIZE = 12;
let CELL_SIZE = 40;
let SEATS: SeatMap = [];

// 拖动缩放参数
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let hoveredSeat: Seat | null = null;

const ZONE_COLOR: Record<string, string> = {
  'VIP': '#ffd54f',
  'Standard': '#90caf9'
};
const STATUS_BORDER_COLOR: Record<Seat['status'], string> = {
  available: '#555',
  selected: '#4caf50',
  sold: '#e53935'
};

function resizeCanvas() {
  const containerWidth = document.body.clientWidth;
  canvas.width = containerWidth * dpr;
  canvas.height = 600 * dpr;
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = '600px';
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
  ctx.scale(dpr, dpr);
  drawSeats();
}

function drawSeats() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  if (!SEATS.length) return;
  CELL_SIZE = Math.min(40, Math.floor((canvas.width / dpr) / SEATS[0].length) - PADDING);

  ctx.font = `${FONT_SIZE}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < SEATS.length; row++) {
    for (let col = 0; col < SEATS[row].length; col++) {
      const seat = SEATS[row][col];
      const x = col * (CELL_SIZE + PADDING) + 60;
      const y = row * (CELL_SIZE + PADDING) + 40;

      ctx.fillStyle = ZONE_COLOR[seat.zone];
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      ctx.strokeStyle = STATUS_BORDER_COLOR[seat.status];
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

      ctx.fillStyle = '#000';
      ctx.fillText(seat.label, x + CELL_SIZE / 2, y + CELL_SIZE / 2);

      if (hoveredSeat && hoveredSeat.row === seat.row && hoveredSeat.col === seat.col) {
        drawTooltip(seat, x + CELL_SIZE + 10, y);
      }
    }
  }

  ctx.fillStyle = '#333';
  for (let row = 0; row < SEATS.length; row++) {
    ctx.fillText(String.fromCharCode(65 + row), 30, row * (CELL_SIZE + PADDING) + 40 + CELL_SIZE / 2);
  }
  for (let col = 0; col < SEATS[0].length; col++) {
    ctx.fillText((col + 1).toString(), col * (CELL_SIZE + PADDING) + 60 + CELL_SIZE / 2, 20);
  }

  ctx.restore();
}

function drawTooltip(seat: Seat, x: number, y: number) {
  const text = `座位: ${seat.label}\n区域: ${seat.zone}\n状态: ${seat.status}`;
  const lines = text.split('\n');

  const padding = 8;
  const width = 100;
  const height = lines.length * 18 + padding;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = '12px Arial';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x + padding / 2, y + 18 * (i + 1) - 4);
  }
  ctx.restore();
}

function handleClick(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;

  for (let row = 0; row < SEATS.length; row++) {
    for (let col = 0; col < SEATS[row].length; col++) {
      const sx = col * (CELL_SIZE + PADDING) + 60;
      const sy = row * (CELL_SIZE + PADDING) + 40;
      if (x >= sx && x <= sx + CELL_SIZE && y >= sy && y <= sy + CELL_SIZE) {
        const seat = SEATS[row][col];
        if (seat.status === 'available') seat.status = 'selected';
        else if (seat.status === 'selected') seat.status = 'available';
        drawSeats();
        return;
      }
    }
  }
}

function handleWheel(e: WheelEvent) {
  e.preventDefault();
  const scaleAmount = -e.deltaY * 0.001;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  const prevScale = scale;

  scale = Math.min(3, Math.max(0.5, scale + scaleAmount));
  offsetX -= (mouseX - offsetX) * (scale / prevScale - 1);
  offsetY -= (mouseY - offsetY) * (scale / prevScale - 1);

  drawSeats();
}

function handleMouseDown(e: MouseEvent) {
  isDragging = true;
  dragStartX = e.clientX - offsetX;
  dragStartY = e.clientY - offsetY;
}

function handleMouseMove(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;

  if (isDragging) {
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    drawSeats();
    return;
  }

  hoveredSeat = null;
  for (let row = 0; row < SEATS.length; row++) {
    for (let col = 0; col < SEATS[row].length; col++) {
      const sx = col * (CELL_SIZE + PADDING) + 60;
      const sy = row * (CELL_SIZE + PADDING) + 40;
      if (x >= sx && x <= sx + CELL_SIZE && y >= sy && y <= sy + CELL_SIZE) {
        hoveredSeat = SEATS[row][col];
        break;
      }
    }
  }
  drawSeats();
}

function handleMouseUp() {
  isDragging = false;
}

async function loadSeatMap() {
  const rows = 15;
  const cols = 20;
  SEATS = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      return {
        row: r,
        col: c,
        label: `${String.fromCharCode(65 + r)}${c + 1}`,
        status: Math.random() < 0.1 ? 'sold' : 'available',
        zone: r < 3 ? 'VIP' : 'Standard'
      };
    })
  );
  drawSeats();
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('wheel', handleWheel);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
window.addEventListener('resize', resizeCanvas);

loadSeatMap();
resizeCanvas();
