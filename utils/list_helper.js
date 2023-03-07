const listReturns1 = (array) => 1;

const totalLikes = (params) => {
  let sum = 0;
  let array = [...params];
  array.forEach(blog => sum += blog.likes);
  return sum
}

const favoriteBlog = (params) => {
    let array = [...params];
    let result = {likes: 0};
    array.forEach(blog => {
      if(blog.likes > result.likes) {
        result = blog;
      }
    });
    
    return JSON.stringify(result);
}

const mostBlogs = (params) => {
    let array = [...params];
    let blogMap = new Map();
    array.forEach(author => {
        if(!blogMap.has(author.author)) {
            blogMap.set(author.author, 1);
        } else {
            let value = blogMap.get(author.author);
            value++;
            blogMap.set(author.author, value);
        }
    });
   
   
    let blogs = Math.max(...blogMap.values());
    let name;
    let arr = [...blogMap];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i][1] == blogs) {
            name = arr[i][0];
        }
    }
    return ({ name, blogs });
    
}

const mostLikes = (params) => {
    let array = [...params];
    let likeMap = new Map();
    array.forEach(author => {
        if(!likeMap.has(author.author)) {
            likeMap.set(author.author, author.likes);
        } else {
            let value = likeMap.get(author.author);
            value += author.likes;
            likeMap.set(author.author, value);
        }
    });
   
   
    let likes = Math.max(...likeMap.values());
    let name;
    let arr = [...likeMap];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i][1] === likes) {
            name = arr[i][0];
        }
    }
    return ({ name, likes });
    
}

module.exports = { listReturns1, totalLikes, favoriteBlog, mostBlogs, mostLikes }