import { GameResources } from './gameresources';


export class ResourceLoader {
    private resources = new GameResources();

    public loadImages() : {} {
        // playground
        this.resources.addImage('burned-gras', '../../assets/images/bomberman/0.png', 32, 32);
        this.resources.addImage('gras', '../../assets/images/bomberman/1.png', 32, 32);
        this.resources.addImage('wall-light', '../../assets/images/bomberman/91.png', 32, 32);
        this.resources.addImage('wall-dark', '../../assets/images/bomberman/89.png', 32, 32);
        this.resources.addImage('box', '../../assets/images/bomberman/90.png', 32, 32);

        // heroes
        this.resources.addImage('hero-1-d', '../../assets/images/hero/1/d-2.png', 32, 32);
        this.resources.addImage('hero-1-r', '../../assets/images/hero/1/r-2.png', 32, 32);
        this.resources.addImage('hero-1-l', '../../assets/images/hero/1/l-2.png', 32, 32);
        this.resources.addImage('hero-1-u', '../../assets/images/hero/1/u-2.png', 32, 32);
        this.resources.addImage('hero-2-d', '../../assets/images/hero/2/d-2.png', 32, 32);
        this.resources.addImage('hero-2-r', '../../assets/images/hero/2/r-2.png', 32, 32);
        this.resources.addImage('hero-2-l', '../../assets/images/hero/2/l-2.png', 32, 32);
        this.resources.addImage('hero-2-u', '../../assets/images/hero/2/u-2.png', 32, 32);
        this.resources.addImage('hero-3-d', '../../assets/images/hero/3/d-2.png', 32, 32);
        this.resources.addImage('hero-3-r', '../../assets/images/hero/3/r-2.png', 32, 32);
        this.resources.addImage('hero-3-l', '../../assets/images/hero/3/l-2.png', 32, 32);
        this.resources.addImage('hero-3-u', '../../assets/images/hero/3/u-2.png', 32, 32);
        this.resources.addImage('hero-4-d', '../../assets/images/hero/4/d-2.png', 32, 32);
        this.resources.addImage('hero-4-r', '../../assets/images/hero/4/r-2.png', 32, 32);
        this.resources.addImage('hero-4-l', '../../assets/images/hero/4/l-2.png', 32, 32);
        this.resources.addImage('hero-4-u', '../../assets/images/hero/4/u-2.png', 32, 32);
        this.resources.addImage('hero-5-d', '../../assets/images/hero/5/d-2.png', 32, 32);
        this.resources.addImage('hero-5-r', '../../assets/images/hero/5/r-2.png', 32, 32);
        this.resources.addImage('hero-5-l', '../../assets/images/hero/5/l-2.png', 32, 32);
        this.resources.addImage('hero-5-u', '../../assets/images/hero/5/u-2.png', 32, 32);
        this.resources.addImage('hero-6-d', '../../assets/images/hero/6/d-2.png', 32, 32);
        this.resources.addImage('hero-6-r', '../../assets/images/hero/6/r-2.png', 32, 32);
        this.resources.addImage('hero-6-l', '../../assets/images/hero/6/l-2.png', 32, 32);
        this.resources.addImage('hero-6-u', '../../assets/images/hero/6/u-2.png', 32, 32);
        this.resources.addImage('hero-7-d', '../../assets/images/hero/7/d-2.png', 32, 32);
        this.resources.addImage('hero-7-r', '../../assets/images/hero/7/r-2.png', 32, 32);
        this.resources.addImage('hero-7-l', '../../assets/images/hero/7/l-2.png', 32, 32);
        this.resources.addImage('hero-7-u', '../../assets/images/hero/7/u-2.png', 32, 32);
        this.resources.addImage('hero-8-d', '../../assets/images/hero/8/d-2.png', 32, 32);
        this.resources.addImage('hero-8-r', '../../assets/images/hero/8/r-2.png', 32, 32);
        this.resources.addImage('hero-8-l', '../../assets/images/hero/8/l-2.png', 32, 32);
        this.resources.addImage('hero-8-u', '../../assets/images/hero/8/u-2.png', 32, 32);

        this.resources.addImage('thats-me', '../../assets/images/hero/thats-me.png', 32, 32);

        // bombs
        this.resources.addImage('bomb5', '../../assets/images/bombs/5.png', 32, 32);
        this.resources.addImage('bomb4', '../../assets/images/bombs/4.png', 32, 32);
        this.resources.addImage('bomb3', '../../assets/images/bombs/3.png', 32, 32);
        this.resources.addImage('bomb2', '../../assets/images/bombs/2.png', 32, 32);
        this.resources.addImage('bomb1', '../../assets/images/bombs/1.png', 32, 32);
        this.resources.addImage('bomb0', '../../assets/images/bombs/0.png', 32, 32);

        // explosions
        this.resources.addImage('explosionFullCenter', '../../assets/images/explosion/explosionFullCenter.png', 32, 32);

        // powerups
        this.resources.addImage('powerupBlue', '../../assets/images/powerups/powerupBlue.png', 32, 32);
        this.resources.addImage('powerupRed', '../../assets/images/powerups/powerupRed.png', 32, 32);

        // misc
        this.resources.addImage('bush', '../../assets/images/misc/bush.png', 32, 32);

        return this.resources.images;

    }
    public loadAudio() : {} {
        this.resources.addAudio('loop', '../../assets/audio/loop.mp3');
        this.resources.addAudio('lost', '../../assets/audio/lost.mp3');
        this.resources.addAudio('boom', '../../assets/audio/booom.mp3');
        return this.resources.audios;

    }

    public resourcesLoaded(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve();
            }, 3000);
        });
    }

}
