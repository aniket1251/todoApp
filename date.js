
exports.date = ()=>{
let today = new Date();

let options = {
    day: "numeric",
    year: "numeric",
    month:"short",
    weekday: "long"
};
let day = today.toLocaleDateString("en-US", options);
return day;
}

exports.day = ()=>{
let today = new Date();
let options = {
    weekday: "long"
};
let day = today.toLocaleDateString("en-US", options);
return day;
}
