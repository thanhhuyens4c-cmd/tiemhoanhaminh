/**
 * Tạm ẩn trang Blog và Giới thiệu.
 * Để hiện lại: đổi HIDE_BLOG_AND_ABOUT thành false (hoặc xoá thẻ script này khỏi các trang).
 */
(function () {
  var HIDE_BLOG_AND_ABOUT = true;
  if (!HIDE_BLOG_AND_ABOUT) return;

  var path = location.pathname.toLowerCase();
  if (/\/(blog|gioi-thieu|bai-viet)(\.html)?$/.test(path)) {
    location.replace('index.html');
    return;
  }

  var links = 'a[href^="blog.html"], a[href^="gioi-thieu.html"], a[href^="bai-viet.html"]';
  var sel = links + ', li:has(> a[href^="blog.html"]), li:has(> a[href^="gioi-thieu.html"]), #home-blog';
  var style = document.createElement('style');
  style.textContent = sel + ' { display: none !important; }';
  document.head.appendChild(style);
})();
