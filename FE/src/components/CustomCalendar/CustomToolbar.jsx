import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './CustomToolbar.css';

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

const CustomToolbar = (toolbar) => {
    const [weeks, setWeeks] = useState([]);
    const [selectCurrentWeek, setSelectCurrentWeek] = useState(null);
    const [currentView, setCurrentView] = useState(toolbar.view);

    useEffect(() => {
        setCurrentView(toolbar.view); 
      }, [toolbar.view]);

    useEffect(() => {
        const year = new Date().getFullYear();
        setWeeks(getWeeksInYear(year));

        const today = moment();
        const currentWeek = getWeeksInYear(year).findIndex(week => today.isBetween(week.start, week.end, null, '[]'));
        setSelectCurrentWeek(currentWeek);
    }, []);

    const handleWeekSelect = (e) => {
        const selectedWeekIndex = e.target.value;
        const selectedWeek = weeks[selectedWeekIndex];

        if (selectedWeek) {
            toolbar.onNavigate('date', selectedWeek.start);
            setSelectCurrentWeek(selectedWeekIndex);
        }
    };

    const goToToday = () => {
        const today = new Date();
        toolbar.onNavigate('date', today);
        const currentWeek = weeks.findIndex(week => moment(today).isBetween(week.start, week.end, null, '[]'));
        setSelectCurrentWeek(currentWeek);
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

    return (
        <div className="custom-toolbar">
           <div>
           <button onClick={goToToday}>Today</button>
            <select value={selectCurrentWeek || ""} onChange={handleWeekSelect}>
                <option value="">Select a week</option>
                {weeks.map((week, index) => (
                    <option key={index} value={index}>
                        {`${moment(week.start).format('DD/MM')} - ${moment(week.end).format('DD/MM')}`}
                    </option>
                ))}
            </select>
           </div>
            <span>{label()}</span>
           <div>
           <button onClick={() => toolbar.onView('month')} className={currentView === 'month' ? 'active-view' : ''}>Month</button>
           <button onClick={handleWeekView} className={currentView === 'agenda' ? 'active-view' : ''}>Week</button>
           </div>
        </div>
    );
};

export default CustomToolbar;
