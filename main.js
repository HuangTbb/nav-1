const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
let time = null;
const hashMap = JSON.parse(localStorage.getItem('links')) || [
    {logo:'b', label:'百度', link :'https://baidu.com'},
    {logo:'w', label:'微博', link :'https://weibo.com'}
]
const coverDiv = $(`
      <div class="cover">
         <div class="edit">修改</div>
         <div class="delete">删除</div>
      </div>`)

const setHeight = (el)=> {
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight = window.innerHeight
    el.css('height', scrollY+windowHeight-1)
}
const alert = (message) =>{
    const alert = $('.alertBox')
    setHeight(alert)
    alert.find('p').text(message)
    alert.addClass('selected')
    alert.find('button').on('click', ()=>{
        alert.removeClass('selected')
    })
}
const setLocalStorage= (hashMap)=>{
    localStorage.setItem('links', JSON.stringify(hashMap))
}
const deleteLink = (index)=>{
    hashMap.splice(index, 1)
    setLocalStorage(hashMap)
    hashMaprender()
}
const editLink = (node, index) => {
    const editForm = $('.editForm')
    setHeight(editForm)
    editForm.addClass('selected')
    $('input[name="editname"]').attr("value", node.logo)
    $('input[name="editlink"]').attr("value", node.link)
    $('input[name="editlabel"]').attr("value", node.label)
    $('.editCancel').on('click', ()=>{
        editForm.removeClass('selected')
    })
    $('.editComfirm').on('click', ()=>{
        editLinkComfirm(index)
    })
    $(document).on('keypress',(e)=>{
        if(e.keyCode === 13){
            editLinkComfirm(index)
        }
    })
}
const editLinkComfirm = (index)=>{
    const name = $('input[name="editname"]').val()
    const label = $('input[name="editlabel"]').val()
    const link = $('input[name="editlink"]').val()
    if(label === '' || label === ' '){
        alert("名称不能为空！")
        return
    }
    const hashMapCope = hashMap.slice(0, hashMap.length)
    hashMapCope.splice(index, 1)
    if(hashMapCope.map(item=> item.logo).indexOf(name) >= 0){
        alert("图标名已存在！")
    }else if(name === '' || name === ' '){
        alert("图标名不能为空！")
    }else if(name.trim().length > 1){
        alert("图标名太长，只支持一个字符！")
    }else if(!(/[a-z0-9]/.test(name))){
        alert("图标名必需在【a-z0-9】范围！")
    }else if(link === '' || link === ' '){
        alert("网址不能为空！")
    }else{
        hashMap[index].logo = name.trim()
        hashMap[index].label = label.trim()
        hashMap[index].link = link.trim()
        setLocalStorage(hashMap)
        $('.editForm').css("display", "none")
        hashMaprender()
        location.reload()
        $(document).scrollTop($(document).height()-$(window).height())
    }
}
const allEditOperate = (node, index, $li)=>{
    $li.append(coverDiv)
    if(($li.offset().left + 170) > $('body').width()){
        coverDiv.attr("class","cover mobileright")
    }else{
        if($(document).width() < 500){
            coverDiv.attr("class","cover mobile")
        }else{
            coverDiv.attr("class","cover")
        }
    }
    $li.find('.delete').on('click', ()=>{
        deleteLink(index)
    })
    $li.find('.edit').on('click', ()=>{
        editLink(node, index)
        $li.find('.cover').remove()
    })
}
function hashMaprender(){
    $siteList.find('li:not(.last)').remove()
    hashMap.forEach((node, index)=>{
        const $li = $(`
        <li class="liLink">
            <div class="aLink">
                <div class="site">
                    <div class="logo"><span>${node.logo.toUpperCase()}</span></div>
                    <div class="link">${node.label}</div>
                </div>
            </div>
            <div class="options">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M510.583233 336.595085c39.638789 0 71.828932-32.160467 71.828932-71.830979s-32.190143-71.829955-71.828932-71.829955c-39.702234 0-71.830979 32.159444-71.830979 71.829955S470.880999 336.595085 510.583233 336.595085M510.583233 408.42504c-39.702234 0-71.830979 32.160467-71.830979 71.830979 0 39.669488 32.128745 71.797209 71.830979 71.797209 39.638789 0 71.828932-32.127721 71.828932-71.797209C582.412165 440.585507 550.222021 408.42504 510.583233 408.42504M510.583233 623.88523c-39.702234 0-71.830979 32.191166-71.830979 71.828932 0 39.703257 32.128745 71.830979 71.830979 71.830979 39.638789 0 71.828932-32.127721 71.828932-71.830979C582.412165 656.076396 550.222021 623.88523 510.583233 623.88523" fill="#5f6368"></path></svg>
            </div>
        </li>
        `).insertBefore($lastLi)
        $li.find('.aLink').on("click", ()=>{
            location.href = node.link
        })
        if($(document).width() < 500){
            $li.on({
                "touchstart":function(){
                    time = setTimeout(()=>{
                        allEditOperate(node, index, $li)
                    },800);
                },
                "touchmove":function(){
                    clearTimeout(time);
                },
                "touchend":function(){
                    clearTimeout(time);
                }
            })
        }else{
            $li.find('.options').on('click', ()=>{
                allEditOperate(node, index, $li)
            })
        }
    })
}
hashMaprender()
function addLink(hashMap, hashMaprender){
    const addForm =  $('.addForm')
    const addLinkComfirm = ()=>{
        const nameInput = $('input[name="addname"]')
        const labelInput = $('input[name="addlabel"]')
        const linkInput = $('input[name="addlink"]')
        const name = nameInput.val()
        const label = labelInput.val()
        let link = linkInput.val()
        if(label === '' || label === ' '){
            alert("名称不能为空！！")
            return
        }
        if(hashMap.map(item=> item.logo).indexOf(name) >= 0){
            alert("图标名已存在！")
        }else if(name === '' || name === ' '){
            alert("图标名不能为空！")
        }else if(name.trim().length > 1){
            alert("图标名太长，只支持一个字符！")
        }else if(!(/[a-z0-9]/.test(name))){
            alert("图标名必需在【a-z0-9】范围！")
        }else if(link === '' || link === ' '){
            alert("网址不能为空！")
        }else{
            if(link.indexOf('http')=== 0){
                link = 'https' + link.slice(4,)
            }else{
                link = 'https://' + link
            }
            hashMap.push({
                logo: name.trim(),
                label: label.trim(),
                link: link.trim()
            })
            setLocalStorage(hashMap)
            nameInput.val('')
            labelInput.val('')
            linkInput.val('')
            addForm.removeClass('selected')
            hashMaprender()
            $(document).scrollTop($(document).height()-$(window).height())
        }
    }
    $('.addComfirm').on('click', ()=>{
        addLinkComfirm()
    })
    $('.addCancel').on('click', ()=>{
        addForm.removeClass('selected')
    })
    $('.picAddparent').on('click', ()=>{
        addForm.addClass('selected')
        setHeight(addForm)
    })
}
addLink(hashMap,hashMaprender)
// 按下键盘按键跳转
$(document).on('keypress', (e)=>{
    if($('input').is(':focus')) return;
    const {key, keycode} = e
    for(let i=0; i<hashMap.length; i++){
        const logoName = hashMap[i].logo
        const link = hashMap[i].link
        if((keycode >=48 && keycode <= 57) || (keycode >=96 && keycode <= 105)){
            if(logoName === key){
                window.open(link, '_self')
            }
        }else{
            if(logoName.toLowerCase() === key.toLowerCase()){
                window.open(link,'_self')
            }
        }
    }
})
// 点击空白区域隐藏cover
$(document).mouseup(function(e) {
    const pop = $('.cover');
    if(!pop.is(e.target) && pop.has(e.target).length === 0) {
        pop.remove()
    }
});

window.onbeforeunload = ()=>{setLocalStorage(hashMap)}

