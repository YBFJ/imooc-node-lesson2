var https = require('https');
// var Promise = require('Promise');
var cheerio = require('cheerio');
var baseUrl = 'https://www.imooc.com/learn/';
var numberBaseUrl = 'https://www.imooc.com/course/AjaxCourseMembers?ids=';
var videosIds = [348, 637];
// , 348，259, 197, 134, 75;

function filterChapters(page) {
  const $ = cheerio.load(page.html);
  const chapters = $('.chapter');
  let title = $('.hd .l').text();
  let number = page.Lnumber;

  let courseData = { title: title, number: number, videos: [] };

  // courseData ={
  //   title: title,
  //   number: number,
  //   videos: [{
  //     chapterTitle: '',
  //     videos:: [
  //       title: '',
  //     id: ''
  //         ]
  //   }]
  // }

  function trim(str) {
    return str.replace(/[\r\n ]/g, ''); //去除字符算中的空格
  }

  chapters.each(function() {
    let chapter = $(this);
    let chapterTitle = chapter
      .find('h3')
      .text()
      .trim();
    let videos = chapter.find('.video').children('li');
    let chapterData = {
      chapterTitle: chapterTitle,
      videos: []
    };
    // videos.each(function(index, item) {
    //   var video = $(item).find('.J-media-item');

    videos.each(function() {
      let video = $(this).find('.J-media-item');

      let videoTitle = video.text();

      videoTitle = trim(videoTitle);

      // ？？？？  var videoTitle = video.text().trim();

      let id = video.attr('href').split('video/')[1];

      // console.log(videoTitle);
      chapterData.videos.push({
        title: videoTitle,
        id: id
      });
    });

    courseData.videos.push(chapterData);
  });
  return courseData;
}

function printCourseInfo(coursesData) {
  coursesData.forEach(function(courseData) {
    console.log(
      '【' + courseData.number + '】' + ' 人学过' + courseData.title + '\n'
    );
  });
  coursesData.forEach(function(courseData) {
    console.log(
      '----------------------------------------------------------------------------------\n'
    );
    console.log('### ' + courseData.title + '\n');
    console.log(
      '----------------------------------------------------------------------------------\n'
    );
    courseData.videos.forEach(function(item) {
      let chapterTitle = item.chapterTitle;

      console.log(chapterTitle + '\n');

      item.videos.forEach(function(video) {
        console.log('[' + video.id + ']' + video.title + '\n');
      });
    });
  });
}

function getPageAsync(id) {
  return new Promise(function(resolve, reject) {
    // promise的实例对象传入回调函数
    let url = baseUrl + id;
    console.log('正在爬取' + url + '\n');

    let Lnumber = 0;
    let html = '';
    getNumber(id).then(number => {
      Lnumber = number;
    });
    https
      .get(url, function(res) {
        // data事件被触发的时候html累加
        res.on('data', function(data) {
          html += data;
        });

        res.on('end', function() {
          resolve({ html, Lnumber });
          // { html, Lnumber }
          // 请求完成的时候，把html, Lnumber通过resolve返回或者说传递下去
          //var courseData = filterChapters(html);
        });
      })
      .on('error', function(e) {
        reject(e);
        console.log('获取数据出错');
      });
  });
}
// 其实不是很懂这部分ajax获取NUMBER
function getNumber(id) {
  return new Promise((resolve, reject) => {
    https
      .get(numberBaseUrl + id, res => {
        let number = '';
        res.on('data', data => {
          number += data;
          // console.log(data);
          number = JSON.parse(number).data[0].numbers;
          // console.log(number);
        });
        res.on('end', () => {
          resolve(number);
        });
      })
      .on('error', err => {
        reject(err);
        console.log(err);
      });
  });
}

// 爬多个课程并且同时去爬，就可以加上promise的高并发过程

let fetchCourseArray = [];

videosIds.forEach(function(id) {
  fetchCourseArray.push(getPageAsync(id));
});
// push的都是getPageAsync给出来的html

Promise.all(fetchCourseArray).then(function(pages) {
  // Promise.all方法可以接受一个数组
  let coursesData = [];

  pages.forEach(function(page) {
    let courses = filterChapters(page);
    // 用filterChapters对html页面进行解析
    coursesData.push(courses);
  });
  coursesData.sort(function(a, b) {
    return a.number < b.number;
  });
  printCourseInfo(coursesData);
});
