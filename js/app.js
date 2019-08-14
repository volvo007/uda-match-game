/*
 * 创建一个包含所有卡片的数组
 */
let deck = document.querySelector('.deck')
let cards = document.querySelectorAll('.card')
    // notice that cards is not an array, but a NodeArray

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function resetCards() {
    // 尝试过 tempCards = cards, 无法进行后面的循环，只能转成 Array 
    tempCards = Array.prototype.slice.call(cards);
    tempCards = shuffle(tempCards);
    for (let i = 0; i < tempCards.length; i++) {
        tempCards[i].className = 'card';
        deck.appendChild(tempCards[i]);
    }
}

// reset stars to black ones
function resetStar() {
    let stars = document.querySelector('.stars').children;
    for (let item of stars) {
        item.innerHTML = '<i class="fa fa-star"></i>';
    }
}

let count = 0; // clicks count
let openList = []; // already opened cards
let matchList = []; // only allow two cards in the matching list
let stopWatch;

function timeTotal() {
    let total = Math.floor((performance.now() - timeStart)/1000);
    document.querySelector('.timer').textContent = total;
}

// setInterval() 会不停调用函数，直到 clearInterval() 被调用或窗口被关闭。
// 由 setInterval() 返回的 ID 值可用作 clearInterval() 方法的参数
function timer() {
    timeStart = performance.now();
    if (stopWatch) {stopTimer();}
    stopWatch = setInterval("timeTotal()", 1000);
}

function stopTimer() {
    clearInterval(stopWatch);
    stopWatch = -1;
}

function restart() {
    resetCards();
    count = 0;
    document.querySelector('.moves').textContent = '0';
    document.querySelector('.timer').textContent = '0';
    stopTimer();
    openList = [];
    matchList = [];
    resetStar();
}

// listener of button "restart"
function clickRestart() {
    document.querySelector('.restart').addEventListener('click', restart);
}

function howManyStars(clickCount) {
    let stars = document.querySelector('.stars').children;
    if (clickCount > 25) {
        stars[2].innerHTML = '<i class="fa fa-star-o"></i>';
    }
    if (clickCount > 29) {
        stars[1].innerHTML = '<i class="fa fa-star-o"></i>';
    }
    if (clickCount > 33) {
        stars[0].innerHTML = '<i class="fa fa-star-o"></i>';
    }
}

function modalPop() {
    let starCount = 0;
    let emptyStar = "-o";
    let stars = document.querySelector('.stars').children;
    // if can find "-o", it means it's an empty star
    // -1 means it's a full star
    // only add star while it's a full star
    for (item of stars) {
        if (item.innerHTML.indexOf(emptyStar) == -1) {
            starCount += 1;
        }
    }
    // 即使js脚本变量发生了变化（例如这里 totalTime 变量实际上已经归零），但仍然可以使用页面元素的内容来赋值
    // 可以将页面元素的值作为中转传递给下游函数
    let stepCount = document.querySelector('.moves').textContent;
    let total = document.querySelector('.timer').textContent;
    document.querySelector('.modal-body').innerHTML = `<p>With ${stepCount} Moves and ${starCount} Stars</p><p> ${total} seconds`;
    $('#popout1').modal();
}

// restart game if click "play again"
function playAgain() {
    document.querySelector('.close').addEventListener('click', restart);
}

// actions while clicking cards and function to match two cards
function clickCard() {
    document.querySelector('.deck').addEventListener('click', function(e) {
        let target = e.target;
        if (document.querySelector('.timer').textContent == '0' && stopWatch == -1) {timer();}
        if (target.nodeName == 'LI' && !target.classList.contains('open') &&
            !target.classList.contains('match') && matchList.length < 2) {
            console.log('click a close card');
            count += 1;
            howManyStars(count);
            document.querySelector('.moves').textContent = count;
            target.className = 'card open show';
            matchList.push(target);
            console.log(matchList);
            if (matchList.length == 2) {
                if (matchList[0].firstElementChild.className ==
                    matchList[1].firstElementChild.className) {
                    matchList[0].className = 'card open match';
                    matchList[1].className = 'card open match';
                    openList.push(matchList[0])
                    console.log('Match successfully')
                    if (openList.length == 8) {
                        console.log('Congres!');
                        stopTimer();
                        modalPop();
                    }
                    matchList = [];
                } else {
                    matchList.forEach(function(item) {
                        setTimeout(function() {
                            item.className = 'card';
                        }, 1000);
                    });
                    console.log('Match failed')
                    matchList = [];
                }
            }
        }
    })
}

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */


window.onload = function() {
    restart();
    clickCard();
    playAgain();
    clickRestart();
}