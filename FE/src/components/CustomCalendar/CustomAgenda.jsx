import React from 'react';
import moment from 'moment';

const CustomAgenda = ({ event }) => (
  <div>
    <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {moment(event.startAt).format("HH:mm")} -{" "}
        {moment(event.endAt).format("HH:mm")}
        <span style={{ fontSize: "0.625rem" }}>
          {" "}
          (R: {event.numberOfRegistered}/T: {event.requiredInvigilators})
        </span>
      </p>
  </div>
);



export default CustomAgenda;
