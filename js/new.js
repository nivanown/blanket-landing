/*- hormones-section -*/
window.addEventListener("DOMContentLoaded", () => {
  const screenWidth = 700;
  const icons = document.querySelectorAll(".hormones-info__item");
  const paths = [
    {
      offsetFactor: 50,
      path: document.querySelector(".hormones-section__line-img .line"),
    },
    {
      offsetFactor: 50,
      path: document.querySelector(".hormones-section__line-mobile .line"),
    },
  ];

  const getPath = () => {
    return window.innerWidth <= screenWidth ? paths[1] : paths[0];
  };

  const initDashArrays = () => {
    paths.forEach((item, index) => {
      const pathLength = item.path.getTotalLength();

      paths[index].pathLength = pathLength;
      item.path.style.strokeDasharray = pathLength;
    });
  };

  const updateDashOffset = () => {
    const { offsetFactor, path, pathLength } = getPath();
    const rect = path.getBoundingClientRect();

    const startPosition = rect.top - offsetFactor;
    const endPosition = window.innerHeight - rect.height - offsetFactor * 2;

    const progress = Math.max(0, Math.min(1, startPosition / endPosition));
    const offset = pathLength * progress;

    path.style.strokeDashoffset = offset;

    icons.forEach((icon, index) => {
      let threshold;

      if (index === 0) {
        threshold = 0.97;
      } else if (index === 1) {
        threshold = 0.5;
      } else {
        threshold = 0.01;
      }

      if (progress < threshold) {
        icon.classList.add("active");
      } else {
        icon.classList.remove("active");
      }
    });
  };

  window.addEventListener("resize", updateDashOffset);
  window.addEventListener("scroll", updateDashOffset);

  initDashArrays();
  updateDashOffset();
});

/*- video -*/
document.addEventListener("DOMContentLoaded", () => {
  // Классы, которые мы отслеживаем
  const classesToWatch = [
    "insomnia-section__video",
    "insomnia-section__mobile-video",
    "movs-blanket__video",
  ];

  // Функция для поиска элементов с указанными классами
  const findVideos = () => {
    return classesToWatch
      .flatMap((className) =>
        Array.from(document.querySelectorAll(`.${className}`))
      )
      .filter((el, index, self) => self.indexOf(el) === index); // Убираем дубликаты
  };

  const videos = findVideos();

  // Проверяем, есть ли на странице подходящие видео
  if (videos.length === 0) {
    console.info("Видео для отслеживания отсутствуют на странице.");
    return;
  }

  // Callback для IntersectionObserver
  const playVideo = (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.paused) {
          video.play();
        }
      } else {
        video.pause();
      }
    });
  };

  // Создаем наблюдатель
  const observer = new IntersectionObserver(playVideo, {
    root: null, // Отслеживаем относительно окна браузера
    threshold: 0.5, // 50% блока должно быть видно
  });

  // Подключаем наблюдатель к каждому видео
  videos.forEach((video) => observer.observe(video));
});

/*- blanket-img -*/
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sticky-spacer",
      start: "top top",
      end: "bottom-=50%",
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        if (self.progress >= 0.9) {
          document.querySelector(".blanket-img").classList.add("active");
        } else {
          document.querySelector(".blanket-img").classList.remove("active");
        }
      },
    },
  });

  let factor = 0.8;
  let maxShiftUp = -15;
  let maxShiftDown = 15;

  tl.to(
    ".blanket-img [class^='blanket-img']:nth-child(-n+5)",
    {
      yPercent: (index, target, targets) => {
        let normalized = 1 - index / targets.length;
        return maxShiftUp * Math.pow(normalized, factor);
      },
      stagger: 0.04,
    },
    0
  );

  tl.to(
    ".blanket-img [class^='blanket-img']:nth-child(n+7)",
    {
      yPercent: (index, target, targets) => {
        let normalized = 1 - (targets.length - 1 - index) / targets.length;
        return maxShiftDown * Math.pow(normalized, factor);
      },
      stagger: -0.04,
    },
    0
  );

  // tl.to(
  //   ".blanket-img",
  //   {
  //     scale: 1.1,
  //     duration: 1,
  //     ease: "power1.inOut",
  //   },
  //   ">-0.5"
  // );
});

/*- observe-blanket-img -*/
document.addEventListener("DOMContentLoaded", () => {
  const blanketImg = document.querySelector(".blanket-img");

  // Проверяем, существует ли элемент
  if (!blanketImg) {
    console.info("Элемент .blanket-img отсутствует на странице.");
    return;
  }

  const observerOptions = {
    root: null, // Обсервация относительно области просмотра
    rootMargin: "0px", // Без отступов
    threshold: 0.5, // Элемент считается видимым, если 10% его высоты в зоне видимости
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        blanketImg.classList.add("visible");
      } else {
        blanketImg.classList.remove("visible");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  observer.observe(blanketImg);
});
