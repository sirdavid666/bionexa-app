
let recorder = null;
let audioChunks = [];
let stream = null;
let recordingUrl = null;

export function renderLectureRecorder() {
  return `
    <div class="section-intro">
      <h1>Lecture Recorder</h1>
      <p>Record lectures and keep your audio recordings organised.</p>
    </div>

    <div class="calculator-panel">
      <label for="lecture-title">Lecture title</label>
      <input id="lecture-title" type="text"
        placeholder="Enter lecture title">

      <div class="recording-indicator" id="recording-status">
        Ready to record
      </div>

      <div class="recording-controls">
        <button class="primary-button" id="start-recording">
          Start recording
        </button>
        <button class="secondary-button" id="pause-recording" disabled>
          Pause
        </button>
        <button class="secondary-button" id="stop-recording" disabled>
          Stop
        </button>
      </div>

      <div id="recording-result"></div>
    </div>

    <div class="section-heading">
      <h2>Recording information</h2>
      <p>Audio is recorded on your device. Transcription will be added separately.</p>
    </div>
  `;
}

export function bindLectureRecorder() {
  const start = document.querySelector("#start-recording");
  const pause = document.querySelector("#pause-recording");
  const stop = document.querySelector("#stop-recording");
  const status = document.querySelector("#recording-status");
  const result = document.querySelector("#recording-result");

  if (!start || !pause || !stop) return;

  start.addEventListener("click", async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      status.textContent = "Recording is not supported on this device.";
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];

      recorder = new MediaRecorder(stream);

      recorder.addEventListener("dataavailable", event => {
        if (event.data.size > 0) audioChunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(audioChunks, {
          type: recorder.mimeType || "audio/webm"
        });

        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        recordingUrl = URL.createObjectURL(blob);

        const title =
          document.querySelector("#lecture-title").value.trim()
          || "BioNexa Lecture Recording";

        const link = document.createElement("a");
        link.href = recordingUrl;
        link.download = `${title.replace(/[^a-z0-9-_ ]/gi, "")}.webm`;
        link.textContent = "Download recording";

        result.replaceChildren(link);
        status.textContent = "Recording saved for download.";

        stream?.getTracks().forEach(track => track.stop());
        stream = null;
      });

      recorder.start();
      status.textContent = "Recording in progress...";

      start.disabled = true;
      pause.disabled = false;
      stop.disabled = false;
    } catch (error) {
      status.textContent =
        error.name === "NotAllowedError"
          ? "Microphone permission was denied."
          : "Unable to start recording. Please try again.";
    }
  });

  pause.addEventListener("click", () => {
    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.pause();
      pause.textContent = "Resume";
      status.textContent = "Recording paused.";
    } else if (recorder.state === "paused") {
      recorder.resume();
      pause.textContent = "Pause";
      status.textContent = "Recording resumed.";
    }
  });

  stop.addEventListener("click", () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    start.disabled = false;
    pause.disabled = true;
    stop.disabled = true;
    pause.textContent = "Pause";
  });
}
