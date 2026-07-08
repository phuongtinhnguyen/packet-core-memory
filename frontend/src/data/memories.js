const memoryPhotoSources = Array.from({ length: 37 }, (_, index) => `${index + 1}.jpg`);

export const memories = memoryPhotoSources.map((fileName, index) => {
  const paddedNumber = String(index + 1).padStart(2, "0");

  return {
    image: `assets/photos/${fileName}`,
    alt: `Kỷ niệm Packet Core ${paddedNumber}`,
    title: `Kỷ niệm Packet Core ${paddedNumber}`,
  };
});

export const timelineItems = [
  {
    date: "Ngày đầu",
    text: "Team bắt đầu bằng những buổi làm việc còn nhiều bỡ ngỡ.",
  },
  {
    date: "Những ngày đồng hành",
    text: "Chị luôn là người giữ nhịp, nhắc hướng đi và kéo mọi người lại gần nhau hơn.",
  },
  {
    date: "Hôm nay",
    text: "Team gửi chị một lời chúc thật dịu dàng trước kỳ nghỉ sinh.",
  },
];
