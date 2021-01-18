const DateHelper = {
    months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    days: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
};
DateHelper.install = function (Vue) {
    Vue.prototype.$getConst = (key) => {
        return DateHelper[key];
    }
    Vue.prototype.$dateStr = (dateIn) => {
        const d = new Date(dateIn)
        const year = d.getFullYear()
        const date = d.getDate()
        const monthName = DateHelper.months[d.getMonth()]
        const dayName = DateHelper.days[d.getDay()]
        const formattedDate = `${dayName}, ${date} ${monthName} ${year}`
        return formattedDate
    }
};
export default DateHelper;
