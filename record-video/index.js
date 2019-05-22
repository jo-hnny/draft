class Record {
  constructor(canvas, { videoType = 'webm' } = {}) {
    this.canvas = canvas
    this.videoType = videoType

    this.init()
  }

  init() {
    const stream = this.canvas.captureStream()

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    })

    this.recordedBlobs = []

    this.mediaRecorder.ondataavailable = this.handleDataAvailable
  }

  start() {
    this.mediaRecorder.start()
  }

  stop() {
    this.mediaRecorder.stop()
  }

  handleDataAvailable = event => {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data)
    }
  }

  download(name) {
    const blob = new Blob(this.recordedBlobs, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.${this.videoType}`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

const bindPlay = videoContext => {
  const playBtn = document.querySelector('.play')

  const stopBtn = document.querySelector('.stop')

  const downloadBtn = document.querySelector('.download')

  const record = new Record(videoContext._canvas)

  console.log(record)

  playBtn.addEventListener('click', () => {
    console.log('start')
    videoContext.play()

    record.start()
  })

  stopBtn.addEventListener('click', () => {
    console.log('stop')
    videoContext.pause()

    record.stop()
  })

  downloadBtn.addEventListener('click', () => {
    console.log('download')
    record.download('test')
  })
}

const createEffectNodes = (videoContext, n) => {
  const { MONOCHROME, HORIZONTAL_BLUR, COLORTHRESHOLD, AAF_VIDEO_FLIP } = VideoContext.DEFINITIONS

  const effects = [MONOCHROME, HORIZONTAL_BLUR, COLORTHRESHOLD, AAF_VIDEO_FLIP]

  return [...new Array(n)].map(() =>
    videoContext.effect(effects[Math.round(Math.random() * effects.length)])
  )
}

const start = () => {
  const canvas = document.querySelector('canvas')
  const videoContext = new VideoContext(canvas)

  const videoNode = videoContext.video(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  )
  videoNode.startAt(0)

  const effectNodes = createEffectNodes(videoContext, 2)

  effectNodes.concat([videoContext.destination]).reduce((preNode, currentNode) => {
    preNode.connect(currentNode)

    return currentNode
  }, videoNode)

  bindPlay(videoContext)
}

window.onload = start
