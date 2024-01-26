/*
    KWin - the KDE window manager
    This file is part of the KDE project.

    SPDX-FileCopyrightText: 2007 Philip Falkner <philip.falkner@gmail.com>
    SPDX-FileCopyrightText: 2012 Martin Gräßlin <mgraesslin@kde.org>
    SPDX-FileCopyrightText: 2021 Vlad Zahorodnii <vlad.zahorodnii@kde.org>

    SPDX-License-Identifier: GPL-2.0-or-later
*/

const blacklist = [
    // The logout screen has to be animated only by the logout effect.
    "ksmserver ksmserver",
    "ksmserver-logout-greeter ksmserver-logout-greeter",

    // The splash screen has to be animated only by the login effect.
    "ksplashqml ksplashqml",

    // Spectacle needs to be blacklisted in order to stay out of its own screenshots.
    "spectacle spectacle", // x11
    "spectacle org.kde.spectacle", // wayland
];

class FadeEffect {
    constructor() {
        effect.configChanged.connect(this.loadConfig.bind(this));
        effects.windowAdded.connect(this.onWindowAdded.bind(this));
        effects.windowClosed.connect(this.onWindowClosed.bind(this));
        effects.windowDataChanged.connect(this.onWindowDataChanged.bind(this));

        this.loadConfig();
    }

    loadConfig() {
        this.fadeInTime = animationTime(effect.readConfig("FadeInTime", 150));
        this.fadeOutTime = animationTime(effect.readConfig("FadeOutTime", 150)) * 4;
        this.fadeWindows = effect.readConfig("FadeWindows", true); // TODO Plasma 6: Remove it.
    }

    static isFadeWindow(w) {


    }

    onWindowAdded(window) {
        if (!(window.windowClass == "plasmashell plasmashell"
                || window.windowClass == "plasmashell org.kde.plasmashell")) {
            return;
        }
        if (window.popupWindow) {
            return;
        }
        if(window.hasDecoration) return;
        window.setData(Effect.WindowForceBlurRole, true);
        window.fadeInAnimation = effect.animate({
            window: window,
            curve: QEasingCurve.OutExpo,
            duration: this.fadeInTime*2,
            animations: [
                {
                    type: Effect.Opacity,
                    from: 0
                },
                {
                type: Effect.Translation,
                to: {
                    value1: 0,
                    value2: 0
                },
                from: {
                    value1: effects.cursorPos.x - window.x -
                            (window.width - 0) / 2,
                    value2: effects.cursorPos.y - window.y -
                            (window.height - 0) / 2
                }}
            ]
        });
    }

    onWindowClosed(window) {
        if (!(window.windowClass == "plasmashell plasmashell"
                || window.windowClass == "plasmashell org.kde.plasmashell")) {
            return;
        }
        if (window.popupWindow) {
            return;
        }
        if(window.hasDecoration) return;
        window.setData(Effect.WindowForceBlurRole, true);
        window.fadeOutAnimation = animate({
            window: window,
            curve: QEasingCurve.OutExpo,
            duration: this.fadeOutTime,
            animations: [
                {
                    type: Effect.Opacity,
                    to: 0
                },
                {type: Effect.Translation,
                to: {
                    value1: effects.cursorPos.x - window.x -
                            (window.width - 0) / 2,
                    value2: effects.cursorPos.y - window.y -
                            (window.height - 0) / 2
                    },
                from: {
                    value1: 0,
                    value2: 0

                }}

            ]
        });
    }

    onWindowDataChanged(window, role) {
        if (role == Effect.WindowAddedGrabRole) {
            if (effect.isGrabbed(window, Effect.WindowAddedGrabRole)) {
                if (window.fadeInAnimation) {
                    cancel(window.fadeInAnimation);
                    delete window.fadeInAnimation;
                }
            }
        } else if (role == Effect.WindowClosedGrabRole) {
            if (effect.isGrabbed(window, Effect.WindowClosedGrabRole)) {
                if (window.fadeOutAnimation) {
                    cancel(window.fadeOutAnimation);
                    delete window.fadeOutAnimation;
                }
            }
        }
    }
}

new FadeEffect();
