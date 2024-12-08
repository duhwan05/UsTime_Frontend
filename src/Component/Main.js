import React, { useState } from 'react';
import CalendarComponent from './CalendarComponent';
import CalendarDetail from './CalendarDetail';
import styles from '../assets/style/Main.module.scss';
import '../assets/style/MyCalendar.css';

const Main = () => {
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜의 상세 일정

    return (
        <div className={styles.container}>
            <CalendarComponent setSelectedDate={setSelectedDate} />
            <CalendarDetail selectedDate={selectedDate} />
        </div>
    );
};

export default Main;
