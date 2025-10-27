// SpaceX Live Cams Dashboard - GridStack Initialization

document.addEventListener('DOMContentLoaded', function () {
  try {
    const grid = GridStack.init({
      cellHeight: 300,
      margin: 8,
      float: false,
      animate: true,
      disableOneColumnMode: true,
      resizable: {
        handles: 'e, se, s, sw, w',
      },
      draggable: {
        handle: '.video-wrapper',
        appendTo: 'body',
        scroll: false,
      },
    });

    const itemCount = document.querySelectorAll('.grid-stack-item').length;
    console.log('GridStack initialized with', itemCount, 'items');
    console.log('Draggable handle:', '.video-wrapper');
    console.log('Resizable handles:', 'e, se, s, sw, w');
  } catch (error) {
    console.error('Error initializing GridStack:', error);
  }
});
