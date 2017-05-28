import { vec3 } from 'gl-matrix';

class LightingDirection {
    constructor(program) {
        this.program = program;
    }

    getDirection() {
        let x = parseFloat(document.getElementById('directionX').value);
        let y = parseFloat(document.getElementById('directionY').value);
        let z = parseFloat(document.getElementById('directionZ').value);

        return {x, y, z};
    }

    setDirection(x, y, z) {
        document.getElementById('directionX').value = x;
        document.getElementById('directionY').value = y;
        document.getElementById('directionZ').value = z;

        this.updateDirection();
    }

    getRGB() {
        let r = parseFloat(document.getElementById('directionR').value);
        let g = parseFloat(document.getElementById('directionG').value);
        let b = parseFloat(document.getElementById('directionB').value);

        return {r, g, b};
    }

    setRGB(r, g, b) {
        document.getElementById('directionR').value = r;
        document.getElementById('directionG').value = g;
        document.getElementById('directionB').value = b;

        this.updateColor();
    }

    updateDirection() {
        let dir = this.getDirection();
        let adjustedLD = vec3.fromValues(dir.x, dir.y, dir.z);
        vec3.normalize(adjustedLD, adjustedLD);
        vec3.scale(adjustedLD,  adjustedLD, -1);

        this.program.setUniform('lightingDirection', 'uniform3f', adjustedLD[0], adjustedLD[1], adjustedLD[2]);
    }

    updateColor() {
        let color = this.getRGB();
        this.program.setUniform('directionalColor', 'uniform3f', color.r, color.g, color.b);
    }

    update() {
        this.updateDirection();
        this.updateColor();
    }
}

export default LightingDirection;