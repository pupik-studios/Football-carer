"use strict";

const Sfx = (() => {
    let ctx = null;
    let master = null;
    let musicGain = null;
    let muted = localStorage.getItem("fc-muted") === "1";
    let musicWanted = false;
    let themeOn = false;
    let themeGen = 0;
    let themeTimer = 0;
    let musicNodes = [];

    function ensure() {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        if (!ctx) {
            ctx = new AC();
            master = ctx.createGain();
            master.gain.value = muted ? 0 : 0.55;
            master.connect(ctx.destination);
            musicGain = ctx.createGain();
            musicGain.gain.value = 0.16;
            musicGain.connect(master);
        }
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
    }

    function stopMusicVoices() {
        themeOn = false;
        themeGen += 1;
        if (themeTimer) {
            clearTimeout(themeTimer);
            themeTimer = 0;
        }
        const now = ctx ? ctx.currentTime : 0;
        musicNodes.forEach(function (node) {
            try { node.stop(now); } catch (e) {}
            try { node.disconnect(); } catch (e) {}
        });
        musicNodes = [];
        if (musicGain && ctx) {
            musicGain.gain.cancelScheduledValues(now);
            musicGain.gain.setValueAtTime(0, now);
        }
    }

    function setMuted(value) {
        muted = value;
        localStorage.setItem("fc-muted", muted ? "1" : "0");
        const now = ctx ? ctx.currentTime : 0;
        if (muted) {
            stopMusicVoices();
            if (master && ctx) {
                master.gain.cancelScheduledValues(now);
                master.gain.setValueAtTime(0, now);
            }
        } else {
            if (master && ctx) {
                master.gain.cancelScheduledValues(now);
                master.gain.setValueAtTime(0.55, now);
            }
            if (musicGain && ctx) {
                musicGain.gain.cancelScheduledValues(now);
                musicGain.gain.setValueAtTime(0.16, now);
            }
            if (musicWanted) themeStart();
        }
    }

    function isMuted() {
        return muted;
    }

    function noise(duration) {
        const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < data.length; i++) {
            last = last * 0.97 + (Math.random() * 2 - 1) * 0.03;
            data[i] = last * 4;
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        return src;
    }

    function envGain(start, peak, attack, dur) {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(peak, start + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        return g;
    }

    function osc(type, freq, start, dur, peak, slide) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(freq, start);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, start + dur);
        const g = envGain(start, peak, 0.012, dur);
        o.connect(g).connect(master);
        o.start(start);
        o.stop(start + dur + 0.02);
    }

    function click() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        osc("square", 880, t, 0.05, 0.12, 420);
    }

    function start() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        osc("sawtooth", 196, t, 0.22, 0.18);
        osc("sawtooth", 247, t + 0.12, 0.22, 0.16);
        osc("sawtooth", 330, t + 0.24, 0.38, 0.2);
        osc("triangle", 392, t + 0.24, 0.4, 0.08);
        crowd(t, 0.9, 0.12);
    }

    function train() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        osc("triangle", 180, t, 0.12, 0.14, 420);
        osc("square", 520, t + 0.08, 0.1, 0.08, 760);
    }

    function rest() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        osc("sine", 392, t, 0.35, 0.1, 220);
        osc("sine", 494, t + 0.08, 0.4, 0.07, 196);
    }

    function whistle() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        const src = noise(0.22);
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 2800;
        bp.Q.value = 12;
        const g = envGain(t, 0.45, 0.005, 0.2);
        src.connect(bp).connect(g).connect(master);
        src.start(t);
        osc("sine", 2100, t, 0.16, 0.22, 2400);
    }

    function crowd(start, dur, intensity) {
        const src = noise(dur);
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 900;
        const g = envGain(start, intensity, 0.08, dur);
        src.connect(f).connect(g).connect(master);
        src.start(start);
    }

    function kick(start) {
        osc("sine", 140, start, 0.18, 0.28, 45);
        const src = noise(0.08);
        const g = envGain(start, 0.18, 0.002, 0.08);
        src.connect(g).connect(master);
        src.start(start);
    }

    function goal() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        whistle();
        kick(t + 0.12);
        crowd(t, 1.6, 0.28);
        osc("sawtooth", 262, t + 0.18, 0.35, 0.16);
        osc("sawtooth", 330, t + 0.28, 0.4, 0.16);
        osc("sawtooth", 392, t + 0.4, 0.55, 0.2);
        osc("triangle", 523, t + 0.4, 0.6, 0.1);
    }

    function miss() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        whistle();
        crowd(t, 0.9, 0.1);
        osc("triangle", 196, t + 0.15, 0.35, 0.1, 110);
    }

    function matchKickoff() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        whistle();
        crowd(t, 2.1, 0.22);
        osc("sine", 196, t + 0.2, 0.5, 0.08);
    }

    function transferBig(required) {
        if (!ensure()) return;
        const t = ctx.currentTime;
        const heat = Math.min(1, (required || 0) / 92);
        crowd(t, 1.4 + heat * 1.2, 0.14 + heat * 0.22);
        const notes = heat >= 0.85
            ? [261, 329, 392, 523, 659, 784]
            : heat >= 0.6
                ? [330, 392, 523, 659]
                : [392, 523, 659];
        notes.forEach((freq, i) => {
            osc("triangle", freq, t + i * 0.09, 0.28, 0.12 + heat * 0.06);
        });
        if (heat >= 0.85) osc("sawtooth", 1046, t + 0.55, 0.7, 0.1);
    }

    function champ() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        crowd(t, 2.2, 0.32);
        [392, 523, 659, 784].forEach((freq, i) => {
            osc("sawtooth", freq, t + i * 0.14, 0.4, 0.18);
        });
        osc("triangle", 1046, t + 0.55, 0.8, 0.12);
    }

    function suspense() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        crowd(t, 1.4, 0.12);
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (i) {
            osc("triangle", 220 + i * 70, t + i * 0.14, 0.12, 0.07 + i * 0.01);
        });
        osc("sine", 880, t + 1.2, 0.22, 0.1);
        osc("sine", 1320, t + 1.28, 0.28, 0.08);
    }

    function ding() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        osc("sine", 880, t, 0.18, 0.12);
        osc("sine", 1320, t + 0.04, 0.22, 0.08);
    }

    function error() {
        if (!ensure()) return;
        const t = ctx.currentTime;
        osc("square", 140, t, 0.16, 0.12, 90);
    }

    function unlock() {
        ensure();
    }

    function tone(type, freq, start, dur, peak, dest, slide) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(freq, start);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, start + dur);
        const g = envGain(start, peak, 0.02, dur);
        o.connect(g).connect(dest || master);
        o.start(start);
        o.stop(start + dur + 0.03);
        if (dest === musicGain) musicNodes.push(o);
    }

    function hat(start, peak) {
        const src = noise(0.035);
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 7000;
        const g = envGain(start, peak, 0.001, 0.035);
        src.connect(hp).connect(g).connect(musicGain);
        src.start(start);
        musicNodes.push(src);
    }

    function logo() {
        if (!ensure() || muted) return;
        const t = ctx.currentTime;
        tone("sine", 98, t, 0.35, 0.14, musicGain);
        tone("sine", 147, t + 0.08, 0.4, 0.1, musicGain);
        tone("sine", 196, t + 0.2, 0.55, 0.12, musicGain);
        crowd(t, 0.8, 0.08);
    }

    function playThemeLoop() {
        if (!themeOn || !ctx || muted) return;
        if (musicGain) musicGain.gain.setValueAtTime(0.18, ctx.currentTime);
        const src = noise(3.4);
        src.loop = true;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 580;
        const g = ctx.createGain();
        g.gain.value = 0.2;
        src.connect(lp).connect(g).connect(musicGain);
        src.start();
        musicNodes.push(src);
        const drone = ctx.createOscillator();
        drone.type = "sine";
        drone.frequency.value = 49;
        const dg = ctx.createGain();
        dg.gain.value = 0.045;
        drone.connect(dg).connect(musicGain);
        drone.start();
        musicNodes.push(drone);
    }

    function themeStart() {
        musicWanted = true;
        if (!ensure() || muted || themeOn) return;
        themeOn = true;
        themeGen += 1;
        playThemeLoop();
    }

    function themeStop() {
        musicWanted = false;
        stopMusicVoices();
    }

    function halt() {
        stopMusicVoices();
        if (ctx && ctx.state === "running") ctx.suspend();
    }

    function wake() {
        if (!ctx || muted) return;
        if (ctx.state === "suspended") ctx.resume();
        if (musicWanted && !themeOn) themeStart();
    }

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") halt();
        else wake();
    });
    window.addEventListener("pagehide", halt);
    window.addEventListener("freeze", halt);

    function injury() {
        if (!ensure() || muted) return;
        const t = ctx.currentTime;
        osc("sine", 90, t, 0.22, 0.22, 42);
        osc("square", 160, t + 0.04, 0.18, 0.1, 70);
        crowd(t, 0.7, 0.08);
    }

    return {
        click, start, train, rest, whistle, goal, miss,
        transferBig, matchKickoff, champ, ding, suspense, error, injury,
        logo, themeStart, themeStop, halt, wake,
        unlock, setMuted, isMuted
    };
})();
