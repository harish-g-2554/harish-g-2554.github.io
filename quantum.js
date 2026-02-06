/* ============================================
   QUANTUM ANIMATIONS ENGINE
   Author: Harish G
   Description: Advanced quantum-inspired particle animations
   ============================================ */

class QuantumCanvas {
    constructor() {
        this.canvas = document.getElementById('quantum-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.waveParticles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.time = 0;
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        this.themes = {
            light: {
                primary: '#262626',
                secondary: '#404040',
                tertiary: '#525252',
                connectionRgb: '38, 38, 38',
                waveRgba: 'rgba(64, 64, 64, 0.3)',
                fieldColors: ['rgba(38, 38, 38, 0.04)', 'rgba(64, 64, 64, 0.02)', 'rgba(255, 255, 255, 0)']
            },
            dark: {
                primary: '#d4d4d4',
                secondary: '#a3a3a3',
                tertiary: '#737373',
                connectionRgb: '212, 212, 212',
                waveRgba: 'rgba(163, 163, 163, 0.3)',
                fieldColors: ['rgba(212, 212, 212, 0.04)', 'rgba(163, 163, 163, 0.02)', 'rgba(10, 10, 10, 0)']
            }
        };
        
        this.config = {
            particleCount: 100,
            waveParticleCount: 50,
            maxDistance: 150,
            particleSpeed: 0.5,
            colors: this.isDark ? this.themes.dark : this.themes.light
        };

        this.init();
    }
    
    updateTheme(theme) {
        this.isDark = theme === 'dark';
        this.config.colors = this.isDark ? this.themes.dark : this.themes.light;
        // Recreate particles with new colors
        this.particles = [];
        this.waveParticles = [];
        this.createParticles();
        this.createWaveParticles();
    }

    init() {
        this.resize();
        this.createParticles();
        this.createWaveParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.waveParticles = [];
            this.createParticles();
            this.createWaveParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new QuantumParticle(this.canvas, this.config));
        }
    }

    createWaveParticles() {
        for (let i = 0; i < this.config.waveParticleCount; i++) {
            this.waveParticles.push(new WaveParticle(this.canvas, this.config, i));
        }
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${this.config.colors.connectionRgb}, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawQuantumWave() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.colors.waveRgba;
        this.ctx.lineWidth = 2;

        for (let x = 0; x < this.canvas.width; x += 5) {
            const y = this.canvas.height / 2 + 
                      Math.sin(x * 0.01 + this.time * 0.02) * 50 +
                      Math.sin(x * 0.02 + this.time * 0.03) * 30;
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

    drawQuantumField() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, this.config.colors.fieldColors[0]);
        gradient.addColorStop(0.5, this.config.colors.fieldColors[1]);
        gradient.addColorStop(1, this.config.colors.fieldColors[2]);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background quantum field
        this.drawQuantumField();
        
        // Draw quantum wave
        this.drawQuantumWave();
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        // Draw connections
        this.drawConnections();

        // Update and draw wave particles
        this.waveParticles.forEach(particle => {
            particle.update(this.time);
            particle.draw(this.ctx);
        });

        this.time++;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
    }
}

class QuantumParticle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * this.config.particleSpeed;
        this.speedY = (Math.random() - 0.5) * this.config.particleSpeed;
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
        const colors = [
            this.config.colors.primary,
            this.config.colors.secondary,
            this.config.colors.tertiary
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse) {
        // Basic movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction - quantum tunneling effect
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }
        }

        // Boundary check with quantum wrap
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx) {
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
        const size = this.size + pulse * 0.5;
        
        // Glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 3);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class WaveParticle {
    constructor(canvas, config, index) {
        this.canvas = canvas;
        this.config = config;
        this.index = index;
        this.baseY = canvas.height * (0.3 + Math.random() * 0.4);
        this.x = (canvas.width / config.waveParticleCount) * index;
        this.y = this.baseY;
        this.size = Math.random() * 2 + 1;
        this.amplitude = Math.random() * 30 + 20;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
    }

    update(time) {
        this.y = this.baseY + Math.sin(time * this.frequency + this.phase) * this.amplitude;
        this.x = ((this.canvas.width / this.config.waveParticleCount) * this.index + time * 0.5) % this.canvas.width;
    }

    draw(ctx) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, this.config.colors.secondary);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Floating Quantum Particles in DOM
class QuantumParticleSystem {
    constructor(container) {
        this.container = container || document.getElementById('quantum-particles');
        this.particles = [];
        this.particleCount = 30;
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colors = isDark 
            ? ['#d4d4d4', '#a3a3a3', '#737373']
            : ['#262626', '#404040', '#525252'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            pointer-events: none;
            box-shadow: 0 0 ${size * 2}px ${color};
            animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// Quantum Entanglement Effect
class QuantumEntanglement {
    constructor() {
        this.pairs = [];
        this.init();
    }

    init() {
        // Create CSS for entanglement animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translate(0, 0) scale(1); }
                25% { transform: translate(10px, -20px) scale(1.1); }
                50% { transform: translate(-10px, -10px) scale(0.9); }
                75% { transform: translate(5px, -30px) scale(1.05); }
            }
            
            @keyframes quantumSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes quantumPulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.2); }
            }
            
            @keyframes waveCollapse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
                100% { transform: scale(0); opacity: 0; }
            }
            
            @keyframes superposition {
                0%, 100% { filter: hue-rotate(0deg); }
                50% { filter: hue-rotate(180deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Quantum Text Scramble Effect
class QuantumTextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.queue = [];
        this.frame = 0;
        this.frameRequest = null;
        this.resolve = null;
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(() => this.update());
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize Quantum Effects on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main canvas and make it globally accessible for theme switching
    window.quantumCanvas = new QuantumCanvas();
    
    // Initialize floating particles
    const particleSystem = new QuantumParticleSystem();
    
    // Initialize entanglement effects
    const entanglement = new QuantumEntanglement();
    
    // Add CSS for scramble effect
    const scrambleStyle = document.createElement('style');
    scrambleStyle.textContent = `
        .scramble-char {
            color: var(--quantum-primary);
            text-shadow: 0 0 10px var(--quantum-secondary);
        }
    `;
    document.head.appendChild(scrambleStyle);
});

// Export for use in main.js
window.QuantumCanvas = QuantumCanvas;
window.QuantumParticleSystem = QuantumParticleSystem;
window.QuantumTextScramble = QuantumTextScramble;
