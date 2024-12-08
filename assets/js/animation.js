document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');
    
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    const MATRIX_GREEN = '#00ff00';
    const layers = [3, 4, 3, 3]; // Exakte Layer-Struktur aus dem Bild
    const nodes = [];
    const connections = [];
    let time = 0;

    function calculateBaseSize() {
        const minDimension = Math.min(window.innerWidth, window.innerHeight);
        return minDimension * 0.025;
    }

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        draw() {
            const baseSize = calculateBaseSize();
            const pulse = Math.sin(time + this.pulseOffset) * 8;
            const size = baseSize + pulse;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fillStyle = MATRIX_GREEN;
            ctx.fill();
            ctx.strokeStyle = MATRIX_GREEN;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    function initNetwork() {
        nodes.length = 0;
        connections.length = 0;

        const minDimension = Math.min(window.innerWidth, window.innerHeight);
        const marginX = window.innerWidth * 0.15;
        const marginY = window.innerHeight * 0.15;
        const networkWidth = window.innerWidth - (marginX * 2);
        const networkHeight = minDimension - (marginY * 2);

        // Knoten erstellen mit exakten Positionen wie im Bild
        layers.forEach((layerSize, layerIndex) => {
            const layerX = marginX + (networkWidth * layerIndex / (layers.length - 1));
            const layerMargin = networkHeight / (layerSize + 1);
            
            for (let i = 0; i < layerSize; i++) {
                const layerY = (window.innerHeight - networkHeight) / 2 + layerMargin * (i + 1);
                nodes.push(new Node(layerX, layerY));
            }
        });

        // Vollständige Verbindungen zwischen den Layern
        let currentIndex = 0;
        for (let i = 0; i < layers.length - 1; i++) {
            for (let j = 0; j < layers[i]; j++) {
                for (let k = 0; k < layers[i + 1]; k++) {
                    connections.push({
                        from: nodes[currentIndex + j],
                        to: nodes[currentIndex + layers[i] + k],
                        offset: Math.random() * Math.PI * 2
                    });
                }
            }
            currentIndex += layers[i];
        }
    }

    function drawConnections() {
        const baseSize = calculateBaseSize();
        connections.forEach(conn => {
            const pulse = (Math.sin(time + conn.offset) + 1) / 2;
            
            // Verbindungslinien
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.strokeStyle = `rgba(0, 255, 0, ${0.2 + pulse * 0.8})`;
            ctx.lineWidth = (baseSize * 0.15) + pulse * (baseSize * 0.5);
            ctx.stroke();

            // Pfeilspitzen
            const angle = Math.atan2(conn.to.y - conn.from.y, conn.to.x - conn.from.x);
            const arrowLength = baseSize * 0.75;
            const arrowX = conn.to.x - Math.cos(angle) * (baseSize + 5);
            const arrowY = conn.to.y - Math.sin(angle) * (baseSize + 5);
            
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
                arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
                arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
                arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = MATRIX_GREEN;
            ctx.fill();
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections();
        nodes.forEach(node => node.draw());
        time += 0.03;
        requestAnimationFrame(animate);
    }

    // Event Listener für Fenstergrößenänderungen
    window.addEventListener('resize', () => {
        setCanvasSize();
        initNetwork();
    });

    // Netzwerk initialisieren und Animation starten
    initNetwork();
    animate();
});
