import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './CustomToolbar.css';
import { DatePicker } from 'antd';

function getWeeksInYear(year) {
    const weeks = [];
    let date = new Date(year, 0, 1);
    let weekStart, weekEnd;

    while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
    }

    while (date.getFullYear() === year) {
        weekStart = new Date(date);
        weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);

        weeks.push({
            start: new Date(weekStart),
            end: new Date(weekEnd)
        });

        date.setDate(date.getDate() + 7);
    }

    return weeks;
}

function getMonthInYear(year) {
    const months = [];
    for (let i = 0; i < 12; i++) {
        const monthStart = new Date(year, i, 1);
        months.push(monthStart);
    }
    return months;

}

const CustomToolbar = (toolbar) => {
    const [weeks, setWeeks] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectCurrentWeek, setSelectCurrentWeek] = useState("");
    const [selectCurrentMonth, setSelectCurrentMonth] = useState("");
    const [currentView, setCurrentView] = useState('month');

    useEffect(() => {
        setCurrentView(toolbar.view);
    }, [toolbar.view]);

    useEffect(() => {
        const year = new Date().getFullYear();
        setWeeks(getWeeksInYear(year));
        setMonths(getMonthInYear(year));

        const today = moment();
        const currentWeek = getWeeksInYear(year).findIndex(week => today.isBetween(week.start, week.end, null, '[]'));
        setSelectCurrentWeek(currentWeek);
        const currentMonth = getMonthInYear(year).findIndex(month => today.isSame(month, 'month'));
        setSelectCurrentMonth(currentMonth);
    }, []);

    const handleWeekSelect = (e) => {
        const selectedWeekIndex = e.target.value;
        const selectedWeek = weeks[selectedWeekIndex];

        if (selectedWeek) {
            toolbar.onNavigate('date', selectedWeek.start);
            setSelectCurrentWeek(selectedWeekIndex);
        }
    };

    const handleMonthSelect = (e) => {
        const selectedMonthIndex = e.target.value;
        const selectedMonth = months[selectedMonthIndex];

        if (selectedMonth) {
            toolbar.onNavigate('date', selectedMonth);
            setSelectCurrentMonth(selectedMonthIndex);
        }
    }


    const goToToday = () => {
        const today = new Date();
        toolbar.onNavigate('date', today);
        const currentWeek = weeks.findIndex(week => moment(today).isBetween(week.start, week.end, null, '[]'));
        const currentMonth = months.findIndex(month => moment(today).isSame(month, 'month'));
        if (currentWeek !== -1) {
            const selectedWeek = weeks[currentWeek];
            toolbar.onNavigate('date', selectedWeek.start);
        }
        setSelectCurrentWeek(currentWeek);
        setSelectCurrentMonth(currentMonth);
    }

    const label = () => {
        const date = toolbar.date;
        return moment(date).format('MMMM YYYY');
    };

    const handleWeekView = () => {
        if (selectCurrentWeek !== null) {
            const selectedWeek = weeks[selectCurrentWeek];
            toolbar.onNavigate('date', selectedWeek.start);
        }
        toolbar.onView('agenda');
    };

    const handleMonthView = () => {
        if (selectCurrentMonth !== null) {
            const selectedMonth = months[selectCurrentMonth];
            toolbar.onNavigate('date', selectedMonth);
        }
        toolbar.onView('month');
    };

    return (
        <div className="custom-toolbar">
            <div>
                <button onClick={goToToday}>Today</button>
               
                    <select
                        value={currentView === 'agenda' ? selectCurrentWeek : selectCurrentMonth}
                        onChange={currentView === 'agenda' ? handleWeekSelect : handleMonthSelect}>
                        <option value="">{currentView === 'agenda' ? "Select a week" : "Select a month"}</option>
                        {currentView === 'agenda'
                            ? weeks.map((week, index) => (
                                <option key={index} value={index}>
                                    {`${moment(week.start).format('DD/MM')} - ${moment(week.end).format('DD/MM')}`}
                                </option>
                            ))
                            : months.map((month, index) => (
                                <option key={index} value={index}>
                                    {`${moment(month).format('MMMM')}`}
                                </option>
                            ))}
                    </select>
            </div>
            <span>{label()}</span>
            <div>
                <button onClick={handleMonthView} className={currentView === 'month' ? 'active-view' : ''}>Month</button>
                <button onClick={handleWeekView} className={currentView === 'agenda' ? 'active-view' : ''}>Week</button>
            </div>
        </div>
    );
};



export default CustomToolbar;
