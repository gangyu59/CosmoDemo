document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let currentAnimation = null;
    let animationFrameId = null;

    function clearCurrentAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (currentAnimation) {
            clearInterval(currentAnimation);
            currentAnimation = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document.getElementById('showMosaicImageEffect').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startMosaicImageEffect === 'function') {
            startMosaicImageEffect(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showCosmicDust').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startCosmicDust === 'function') {
            startCosmicDust(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showColorfulWaveAnimation').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startColorfulWaveAnimation === 'function') {
            startColorfulWaveAnimation(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showDigitalRain').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startDigitalRain === 'function') {
            startDigitalRain(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showGalaxySpinner').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startGalaxySpinner === 'function') {
            startGalaxySpinner(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showHypnoticSpiral').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startHypnoticSpiral === 'function') {
            startHypnoticSpiral(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showElectricPlasma').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startElectricPlasma === 'function') {
            startElectricPlasma(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showFallingLeaves').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startFallingLeaves === 'function') {
            startFallingLeaves(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showLavaLamp').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startLavaLamp === 'function') {
            startLavaLamp(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showBigBangExplosion').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startBigBangExplosion === 'function') {
            startBigBangExplosion(canvas, ctx, clearCurrentAnimation);
        }
    });
});