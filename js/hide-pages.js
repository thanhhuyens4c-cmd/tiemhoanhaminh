/**
 * Tạm ẩn trang Blog, Giới thiệu và Hoa 20/10.
 * Để hiện lại: đổi HIDE_BLOG_AND_ABOUT thành false (hoặc xoá thẻ script này khỏi các trang).
 */
(function () {
  var HIDE_BLOG_AND_ABOUT = true;
  window.HNM_HIDE_OCT20 = HIDE_BLOG_AND_ABOUT;
  if (!HIDE_BLOG_AND_ABOUT) return;

  var path = location.pathname.toLowerCase();
  if (/\/(blog|gioi-thieu|bai-viet|hoa-20-10)(\.html)?$/.test(path)) {
    location.replace('index.html');
    return;
  }

  var links = 'a[href^="blog.html"], a[href^="gioi-thieu.html"], a[href^="bai-viet.html"], a[href^="hoa-20-10.html"], a[href="#hoa-20-10"]';
  var sel = links + ', li:has(> a[href^="blog.html"]), li:has(> a[href^="gioi-thieu.html"]), li:has(> a[href^="hoa-20-10.html"]), #home-blog, section#hoa-20-10';
  var style = document.createElement('style');
  style.textContent = sel + ' { display: none !important; }';
  document.head.appendChild(style);
})();
