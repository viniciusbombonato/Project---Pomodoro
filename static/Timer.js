class Timer {
    constructor(root) {
        this.root = root;
        root.innerHTML = Timer.getHTML();

        this.Element = {
            minutes: root.querySelector(".timer__part--minutes"),
            seconds: root.querySelector(".timer__part--seconds"),
            control: root.querySelector(".timer__btn--control"),
            reset: root.querySelector(".timer__btn--reset"),
        };

        console.log("minutes element:", this.Element.minutes);
        console.log("seconds element:", this.Element.seconds);
        console.log("control element:", this.Element.control);
        console.log("reset element:", this.Element.reset);


        this.interval = null;
        this.remainingSeconds = parseInt(this.root.dataset.minutes) * 60; // Use the data-minutes attribute
        this.intervalTime = parseInt(this.root.dataset.interval) * 60;
        this.bigIntervalTime = parseInt(this.root.dataset.bigInter) * 60;
        this.focusTime = this.remainingSeconds;
        this.breakTime = this.intervalTime;
        this.bigBreakTime = this.bigIntervalTime;
        this.isBreak = false;
        this.isBigBreak = false;
        this.sessionCount = 0;

        this.Element.control.addEventListener("click", () => {
            if (this.interval === null) {
                this.start();
            } else {
                this.stop();
            }
        });

        this.Element.reset.addEventListener("click", () => {
            this.stop();
            this.remainingSeconds = this.focusTime;
            this.updateInterfaceTimer();
        });

        this.updateInterfaceTimer();
        this.updateInterfaceControls();
    }

    updateInterfaceTimer() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;

        this.Element.minutes.textContent = minutes.toString().padStart(2, "0");
        this.Element.seconds.textContent = seconds.toString().padStart(2, "0");
    }

    updateInterfaceControls() {
        if (this.interval === null) {
            this.Element.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
            this.Element.control.classList.add("timer__btn--start");
            this.Element.control.classList.remove("timer__btn--stop");
        } else {
            this.Element.control.innerHTML = `<span class="material-icons">pause</span>`;
            this.Element.control.classList.add("timer__btn--stop");
            this.Element.control.classList.remove("timer__btn--start");
        }
    }

    start() {
        this.interval = setInterval(() => {
            this.remainingSeconds--;
            this.updateInterfaceTimer();

            if (this.remainingSeconds === 0) {
                this.stop();
                this.sessionCount++;
                if (this.isBreak === true || this.isBigBreak === true) {
                    this.isBreak = false;
                    this.isBigBreak = false;
                    this.startFocus();
                }
                else if (this.sessionCount % 4 === 0) {
                    this.isBigBreak = true;
                    this.startBigBreak();
                } else {
                    this.isBreak = true;
                    this.startBreak();
                }
            }
        }, 1000);

        this.updateInterfaceControls();
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
        this.updateInterfaceControls();
    }

    startFocus(){
        this.remainingSeconds = this.focusTime;
        console.log("focusTime:", this.focusTime);
        this.playSound();
        alert("Time to focus!")
        this.updateInterfaceTimer();
        this.start();
    }

    startBreak() {
        this.remainingSeconds = this.breakTime;
        console.log("breakTime:", this.breakTime);
        this.playSound();
        this.updateInterfaceTimer();
        alert("Time to rest!");
        this.start();
    }

    startBigBreak() {
        this.remainingSeconds = this.bigBreakTime;
        console.log("bigInterval:", this.bigIntervalTime);
        this.updateInterfaceTimer();
        this.playSound();
        alert("Congratulations, you have now a big interval to rest!");
        this.start();
    }

    playSound(){
        const sound = document.getElementById("timer-end-sound")
        sound.play()
    }

    static getHTML() {
        return `
            <audio id="timer-end-sound" src="static/sound.mp3" preload="auto"></audio>
            <span class="timer__part timer__part--minutes">00</span>
            <span class="timer__part">:</span>
            <span class="timer__part timer__part--seconds">00</span>
            <button type="button" class="timer__btn timer__btn--control timer__btn--start">
                <span class="material-icons">play_arrow</span>
            </button>
            <button type="button" class="timer__btn timer__btn--reset">
                <span class="material-icons">replay</span>
            </button>
        `;
    }
}

const timerElement = document.querySelector(".timer");
new Timer(timerElement);
