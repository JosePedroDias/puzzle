import { Application } from 'pixi.js';

import { Main } from './views/Main';

const main = async () => {
    const app = new Application({
        //backgroundColor: 0xFF00FF,
        backgroundColor: 0xFFFFFF,
        //width: 640,
        //height: 360,
        //resolution: window.devicePixelRatio
        antialias: true,
    });

    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    // @ts-ignore
    app.renderer.view.style.position = 'absolute';
    // @ts-ignore
    app.renderer.view.style.display = 'block';

    const onResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.renderer.emit('resize', window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // @ts-ignore
    document.body.appendChild(app.view);

    const scene = new Main(app);
    app.stage.addChild(scene);
};

main();
