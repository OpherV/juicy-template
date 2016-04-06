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

cameraMovement = false;

document.addEventListener("DOMContentLoaded",function(){
    var image = new Image()
    image.onload = function(e) {
        setupParticles(e.target);
        tick();
    };
    image.src = 'img/particle.png';


    $('a.contact-link').bind('click', function(event) {
        document.querySelector("#contact").classList.remove("shake");
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top),
        }, 1500, 'easeInExpo',
        function(){
            if (cameraMovement) {
                document.querySelector("#contact").classList.add("shake");
            }
        });
        event.preventDefault();
    });

});



var canFormBreak = false;
var physicsOn = true;
var formBroken = false;
var physicsEl = document.querySelector("#contact");
var formElements = physicsEl.querySelectorAll('label, input, textarea');

document.querySelector("input.email").addEventListener("change",function(){
    if (this.value.indexOf("@")==-1){
        this.classList.add("invalid");
        if (canFormBreak){
            breakForm();
        }

    }
    else{
        this.classList.remove("invalid");
    }
});

function breakForm(){
    if (formBroken == false) {
        runPhysics();
        Physics.util.ticker.start();
        setTimeout(function(){
            fixForm();
        }, 10000);
    }
    formBroken = true;
}

function fixForm(){
    physicsOn = false;
    for (var x=0;x<formElements.length;x++){
        var el = formElements[x];
        el.style.transform = "translateX(0) translateY(0) rotate(0)";
        el.style.top = el.originalTop+"px";
        el.style.left = el.originalLeft+"px";
        el.style.transition = "all 1.2s ease-in";
    }
};

function runPhysics() {
    Physics(function () {
        var world = this;

        var pebr = physicsEl.getBoundingClientRect();
        var viewWidth = pebr.width;
        var viewHeight = pebr.height;

        var renderer = Physics.renderer('dom', {
            el: physicsEl,
            width: viewWidth,
            height: viewHeight,
            autoResize: false,
            meta: false // don't display meta data
        });

        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
            windowHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

        var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
        var physicsElements = [];


        for (var x = 0; x < formElements.length; x++) {
            var el = formElements[x];
            var elbr = el.getBoundingClientRect();

            var properties = getElementProperties(el);

            el.originalLeft = $(el).offset().left - $(physicsEl).offset().left;
            el.originalTop= $(el).offset().top -  $(physicsEl).offset().top;


            var myEL = Physics.body('rectangle', {
                width: elbr.width,
                height: elbr.height,
                x: $(el).offset().left - $(physicsEl).offset().left,
                y: $(el).offset().top -  $(physicsEl).offset().top,
                vx: 0,
                cof: 0.99,
                restitution: 0.99
            });
            // console.log( $(el).offset().top -  $(physicsEl).offset().top);
            
            // var test = document.createElement("div");
            // test.style.position = "absolute";
            // test.style.top = $(el).offset().top + "px";
            // test.style.left = $(el).offset().left + "px";
            // test.style.width = elbr.width + "px";
            // test.style.height = elbr.height + "px";
            // test.style.background = "purple";
            // document.body.appendChild(test);

            el.style.position = "absolute";
            el.style.top = 0;
            el.style.left = 0;

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

        //
        var attractor = Physics.behavior('attractor', {
            order: 0,
            strength: -.0003
        });

        attractor.position({
            x: viewWidth/2,
            y: 300
        }) ;

        //world.add( attractor );


        // add the renderer
        world.add(renderer);
        // render on each step
        world.on('step', function () {
            world.render();
        });

        Physics.util.ticker.on(function (time) {
            if (physicsOn){
                world.step(time);
                //DEBUG
                setTimeout(function(){
                    // physicsOn = false;
                },50);
            }
        });


    });

    function getElementProperties( element ) {

        var x = 0;
        var y = 0;
        var width = element.offsetWidth;
        var height = element.offsetHeight;

        do {

            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent
        } while ( element != physicsEl );


        return [ x, y, width, height ];
    }

}
