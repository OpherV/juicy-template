var proton;

function setupParticles(image){
    var canvas = document.body.querySelector(".particles");
    canvas.width = canvas.offsetWidth;
    canvas.height= canvas.offsetHeight;

    var originalRate = new Proton.Rate(new Proton.Span(1, 3), .1);
    var originalLife = new Proton.Life(1, 4);

    proton = new Proton;
    var emitter = new Proton.Emitter();
    emitter.rate = originalRate;
    emitter.addInitialize(new Proton.Mass(0.1));
    emitter.addInitialize(new Proton.ImageTarget(image));
    emitter.addInitialize(new Proton.Position(new Proton.RectZone(canvas.offsetWidth / 2 - 70, canvas.offsetHeight / 2 - 15 , 140, 30)));
    emitter.addInitialize(originalLife);
    emitter.addInitialize(new Proton.V(new Proton.Span(0.2, 0.6), new Proton.Span(0, 360), 'polar'));
    emitter.addBehaviour(new Proton.Color('#eee3ff', '#ff4400'));
    emitter.addBehaviour(new Proton.RandomDrift(1, 1, 1));
    //attractionForce = new Proton.Attraction(mouseObj, 10, 200);
    //emitter.addBehaviour(attractionForce);
    emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.2, 0.5), Proton.getSpan(0, .1)));
    emitter.addBehaviour(new Proton.Alpha(1, .2));
    emitter.emit();
    proton.addEmitter(emitter);
    renderer = new Proton.Renderer('webgl', proton, canvas);
    renderer.blendFunc("SRC_ALPHA", "ONE");
    renderer.start();

    document.querySelector(".particleContainer a").addEventListener("mouseenter",function(){
        emitter.rate = new Proton.Rate(new Proton.Span(1, 3), .01);
        emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.4, 0.5), Proton.getSpan(0, .1)));
        emitter.addInitialize(new Proton.V(new Proton.Span(0.3, 0.6), new Proton.Span(0, 360), 'polar'));
        emitter.addBehaviour(new Proton.Color('#fff7dd', '#ff4400'));
    });

    document.querySelector(".particleContainer a").addEventListener("mouseleave",function(){
        emitter.rate = originalRate;
        emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.2, 0.5), Proton.getSpan(0, .1)));
        emitter.addInitialize(new Proton.V(new Proton.Span(0.2, 0.6), new Proton.Span(0, 360), 'polar'));
        emitter.addBehaviour(new Proton.Color('#eee3ff', '#ff4400'));
    })


}


function tick() {
    requestAnimationFrame(tick);
    if (proton) {
        proton.update();
    }
}


document.addEventListener("DOMContentLoaded",function(){
    var image = new Image()
    image.onload = function(e) {
        setupParticles(e.target);
        tick();
    };
    image.src = 'img/particle.png';


    //runPhysics();
    //Physics.util.ticker.start();

    $('a.contact-link').bind('click', function(event) {
        document.querySelector("#contact").classList.remove("shake");
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50),
        }, 1500, 'easeInExpo',
        function(){
            document.querySelector("#contact").classList.add("shake");
        });
        event.preventDefault();
    });

});

function runPhysics() {
    Physics(function () {
        var world = this;

        var physicsEl = document.querySelector("#contact .container");
        var pebr = physicsEl.getBoundingClientRect();
        var viewWidth = physicsEl.offsetWidth;
        var viewHeight = physicsEl.offsetHeight;

        var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);


        var formElements = physicsEl.querySelectorAll('label, input, textarea');
        var physicsElements = [];


        for (var x = 0; x < formElements.length; x++) {
            var el = formElements[x];
            var elbr = el.getBoundingClientRect();
            var myEL = Physics.body('rectangle', {
                width: elbr.width/2,
                height: elbr.height/2,
                cof: 0.99,
                restitution: 0.99,
                //fixed: true
                //vx: Math.random() * 0.1,
                //vy: Math.random() * 0.1,
            });
            myEL.view = el;
            world.add(myEL);

            physicsElements.push(el);
        }

        world.add([
            Physics.behavior('constant-acceleration')
            ,Physics.behavior('body-impulse-response')
            ,Physics.behavior('body-collision-detection')
            ,Physics.behavior('sweep-prune')
            ,Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 0.2,
                cof: 0.99
            })
        ]);


        var attractor = Physics.behavior('attractor', {
            order: 0,
            strength: -.0009
        });

        attractor.position({
            x: viewWidth/2,
            y: viewHeight/2
        }) ;

        //world.add( attractor );



        var renderer = Physics.renderer('dom', {
            el: physicsEl,
            width: viewWidth,
            height: viewHeight,
            meta: false // don't display meta data
        });

        // add the renderer
        world.add(renderer);
        // render on each step
        world.on('step', function () {
            world.render();
        });

        Physics.util.ticker.on(function (time) {
            world.step(time);
        });


    });
}
