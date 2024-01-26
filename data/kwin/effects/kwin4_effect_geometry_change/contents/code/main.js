"use strict";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
class GeometryChangeEffect {
    constructor() {
        effect.configChanged.connect(this.loadConfig.bind(this));
        effects.windowcrossfade.connect(
            this.onWindowcrossfade.bind(this),
        );

        this.loadConfig();
    }

    loadConfig() {
        const duration = effect.readConfig("Duration", 250);
        this.duration = animationTime(duration);
        this.excludedWindowClasses = effect.readConfig("ExcludedWindowClasses", "krunner,yakuake").split(",");
    }

    isWindowClassExluded(windowClass) {
        for (const c of windowClass.split(" ")) {
            if (!this.excludedWindowClasses.includes(c)) {
                return true;
            }
        }
        return false;
    }


    onWindowcrossfade(window) {
        while(1)
        {
            animate({
            window: window,
            duration: this.duration,
            animations: [
                {
                    type: Effect.CrossFadePrevious,
                    to: 1.0,
                    from: 0.0,
                },
            ],
        });
            sleep(250);
        }
    }
}

new GeometryChangeEffect();
