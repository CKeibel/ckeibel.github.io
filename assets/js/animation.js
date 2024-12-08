document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');
    
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    const NETWORK_COLOR = '#00ffdd';
    const nodes = [];
    const maxNodes = 200;
    let time = 0;

    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.size = 4; // Größere Knoten
            this.flashIntensity = 0;
            this.flashSpeed = 0.01 + Math.random() * 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            if (Math.random() < 0.0005) {
                this.flashIntensity = 1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = NETWORK_COLOR;
            ctx.fill();

            if (this.flashIntensity > 0) {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, this.size,
                    this.x, this.y, this.size * (1 + this.flashIntensity * 30)
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.flashIntensity})`);
                gradient.addColorStop(0.4, `rgba(0, 255, 221, ${this.flashIntensity * 0.5})`);
                gradient.addColorStop(1, 'rgba(0, 255, 221, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
                
                this.flashIntensity -= this.flashSpeed;
                if (this.flashIntensity < 0) this.flashIntensity = 0;
            }
        }
    }

    function initNetwork() {
        nodes.length = 0;
        for (let i = 0; i < maxNodes; i++) {
            nodes.push(new Node());
        }
    }

    function drawConnections() {
        const maxDistance = 250;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - (distance / maxDistance)) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    
                    const combinedFlash = nodes[i].flashIntensity + nodes[j].flashIntensity;
                    const flashOpacity = opacity + (combinedFlash * 0.3);
                    
                    ctx.strokeStyle = `rgba(0, 255, 221, ${flashOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        setCanvasSize();
        initNetwork();
    });

    initNetwork();
    animate();
});
