export default {
  value: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    default: 4,
  },
  autofocus: {
    type: Boolean,
    default: true,
  },
  secure: {
    type: Boolean,
    default: false,
  },
  characterPreview: {
    type: Boolean,
    default: true,
  },
  charPreviewDuration: {
    type: Number,
    default: 300,
  },
};
