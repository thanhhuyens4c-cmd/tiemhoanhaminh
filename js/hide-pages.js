/**
 * Tạm ẩn trang Giới thiệu và Hoa 20/10. Blog (blog.html, bai-viet.html, mục blog ở trang chủ) đang hiện.
 * Để ẩn lại Blog: đổi HIDE_BLOG thành true.
 * Để hiện lại Giới thiệu và Hoa 20/10: đổi HIDE_ABOUT_AND_OCT20 thành false.
 */
(function () {
  var HIDE_BLOG = false;
  var HIDE_ABOUT_AND_OCT20 = true;
  window.HNM_HIDE_OCT20 = HIDE_ABOUT_AND_OCT20;

  var pages = [];
  var links = [];
  var extra = [];
  if (HIDE_BLOG) {
    pages.push('blog', 'bai-viet');
    links.push('a[href^="blog.html"]', 'a[href^="bai-viet.html"]', 'li:has(> a[href^="blog.html"])');
    extra.push('#home-blog');
  }
  if (HIDE_ABOUT_AND_OCT20) {
    pages.push('gioi-thieu', 'hoa-20-10');
    links.push('a[href^="gioi-thieu.html"]', 'a[href^="hoa-20-10.html"]', 'a[href="#hoa-20-10"]',
      'li:has(> a[href^="gioi-thieu.html"])', 'li:has(> a[href^="hoa-20-10.html"])');
    extra.push('section#hoa-20-10');
  }
  if (!pages.length) return;

  var path = location.pathname.toLowerCase();
  if (new RegExp('/(' + pages.join('|') + ')(\\.html)?$').test(path)) {
    location.replace('index.html');
    return;
  }

  var style = document.createElement('style');
  style.textContent = links.concat(extra).join(', ') + ' { display: none !important; }';
  document.head.appendChild(style);
})();
