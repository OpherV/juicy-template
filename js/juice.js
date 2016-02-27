var proton;

function setupParticles(){
    var canvas = document.body.querySelector(".particles");
    canvas.width = canvas.offsetWidth;
    canvas.height= canvas.offsetHeight;

    proton = new Proton;
    var emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(5, 5), .1);
    emitter.addInitialize(new Proton.Mass(0.2));
    //emitter.addInitialize(new Proton.ImageTarget(image));
    emitter.addInitialize(new Proton.Position(new Proton.PointZone(canvas.offsetWidth / 2, canvas.offsetHeight / 2)));
    emitter.addInitialize(new Proton.Life(1, 5));
    emitter.addInitialize(new Proton.V(new Proton.Span(0.1, 0.3), new Proton.Span(0, 360), 'polar'));
    emitter.addBehaviour(new Proton.Color('#ff0000', '#ff4400'));
    //attractionForce = new Proton.Attraction(mouseObj, 10, 200);
    //emitter.addBehaviour(attractionForce);
    emitter.addBehaviour(new Proton.Scale(Proton.getSpan(1, 1.6), Proton.getSpan(0, .1)));
    emitter.addBehaviour(new Proton.Alpha(1, .2));
    emitter.emit();
    proton.addEmitter(emitter);
    renderer = new Proton.Renderer('webgl', proton, canvas);
    renderer.blendFunc("SRC_ALPHA", "ONE");
    renderer.start();
}


function tick() {
    requestAnimationFrame(tick);
    if (proton) {
        proton.update();
    }
}


document.addEventListener("DOMContentLoaded",function(){
    tick();
    setupParticles();
});
