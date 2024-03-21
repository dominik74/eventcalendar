import { addDays, addMonths, eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CalendarEvent, Group } from "../App";
import EventDialog from "./EventDialog";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
    groups: Group[];
}

export default function EventCalendar({events, setEvents, className, groups}: Props) {
    const [now, setNow] = useState(new Date());
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const [mousePosition, setMousePosition] = useState({ top: 0, left: 0 });
    const [quickCreateText, setQuickCreateText] = useState<string>("");
    
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);
    const lastDayOfLastMonth = endOfMonth(subMonths(now, 1));
    const firstDayOfNextMonth = startOfMonth(addMonths(now, 1));
    const lastDayOfNextMonth = endOfMonth(addMonths(now, 1));
    
    const days = eachDayOfInterval({start: firstDayOfMonth, end: lastDayOfMonth});
    const daysNextMonth = eachDayOfInterval({start: firstDayOfNextMonth, end: lastDayOfNextMonth})

    const getStartingDayIndex = () => {
        const index = getDay(firstDayOfMonth) -1;
        return index < 0 ? 6 : index;
    }

    const getEndingDayIndex = () => {
        const index = getDay(lastDayOfMonth) -1;
        return index < 0 ? 6 : index;
    }

    console.log(daysNextMonth);
    
    useEffect(() => {
        if (!isDialogVisible) {
            setIsEditing(false);
        }
    }, [isDialogVisible]);
        
    function isSameDate(date1: Date, date2: Date) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }
    
    function addNewEvent() {
        setSelectedEvent(undefined);
        setIsEditing(false);
        setIsDialogVisible(true);
        console.log("create");
    }

    function addNewEventGlobal() {
	setSelectedDate(new Date());
	addNewEvent();
    }
    
    function editEvent(e: React.MouseEvent, event: CalendarEvent) {
        e.stopPropagation();
        setSelectedEvent(event);
        setIsEditing(true);
        console.log("edit");
        setIsDialogVisible(true);
    }
    
    function getGroupColorByGroupName(groupName: string) {
        const group = groups.find(group => group.name === groupName);
        return group ? group.color : "lightgray";
    }
    
    function getGroupByName(groupName: string) {
        return groups.find(group => group.name === groupName);
    }
    
    function onMouseMove(e: React.MouseEvent) {
        setMousePosition({ top: e.clientY, left: e.clientX });
    }
    
    function processQuickCreateCommand() {
        console.log("processing quick create command...");
        const args = quickCreateText.split(" ");
        
        if (args.length < 2) {
            console.error("too few arguments to process command (>=2 required)")
            return;
        }

        var targetDate = null;
        var targetGroup = "default";

        for (var i = 0; i < args.length; i++) {
            if (i === 0) {
                const dateDay = parseInt(args[i]);

                if (isNaN(dateDay)) {
                    switch (args[i]) {
                    case "tod":
                        targetDate = new Date();
                    break;
                    case "tom":
                        targetDate = addDays(new Date(), 1)
                    break;
                    default:
                        args[0] = args[0].charAt(0).toUpperCase() + args[0].slice(1);
                        const startDate = startOfWeek(now);
                        const weekdayIndex = WEEKDAYS.indexOf(args[0]);
                        targetDate = addDays(startDate, weekdayIndex + 1);

                        if (targetDate.getDate() < (new Date()).getDate()) {
                            targetDate = addDays(targetDate, 7);
                        }
                    break;
                    }
                } else {
                    targetDate = new Date(now.getFullYear(), now.getMonth(), dateDay);

                    if (targetDate.getDate() < (new Date()).getDate()) {
                        targetDate = addMonths(targetDate, 1);
                    }
                }
            } else {
                //TODO: check if it's the last index
                if (args[i].startsWith("#")) {
                    targetGroup = args[i].slice(1);
                    args.splice(i, 1);
                    break;
                }
            }
        }

        if (!targetDate) {
            console.log("date not specified");
            return;
        }

        console.log("arguments: " + args);
        
        const newEvent: CalendarEvent = {
            title: args.slice(1).join(' '),
            date: targetDate,
            groupName: targetGroup,
        };
        
        setEvents([...events, newEvent]);
        setQuickCreateText("");
    }
    
    
    
    return (
    <div className={className}
         onMouseMove={onMouseMove}>
        
        <div className="flex mb-10">
            <div className="flex w-56 items-center">
                <button className="small-button" onClick={() => setNow(now => subMonths(now, 1))}>{"<"}</button>
                <h2 className="flex-1 text-center font-semibold">{format(now, "MMMM yyyy")}</h2>
                <button className="small-button" onClick={() => setNow(now => addMonths(now, 1))}>{">"}</button>
            </div>
            
            {/*quick create (e.g. 'wed work meeting', 'tom birthday party #personal', '14 deadline')*/}
            <div className="bg-gray-200 ml-4 flex-1 flex mt-1 mb-1">
                <input className="w-full"
		       type="text"
                       placeholder="quick create"
                       autoFocus
                       value={quickCreateText}
                       onChange={(e) => setQuickCreateText(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && processQuickCreateCommand()}/>
            </div>

	    <button className="ml-4 mt-1 mb-1" onClick={addNewEventGlobal}>+ event</button>
        </div>

        <table className="table-fixed w-full">
            {WEEKDAYS.map(weekday =>
                <td className="px-1 border border-black" key={weekday}>{weekday}</td>)}
        </table>
        
        <div className="grid grid-cols-7 grid-rows[auto_1fr] flex-1">
            {Array.from({length: firstDayOfMonth.getDay() - 1}).map((_, index) =>
                <div className="border px-1 border-gray-200 bg-gray-50 text-gray-400"
                    key={index}>
                    {lastDayOfLastMonth.getDate() - (firstDayOfMonth.getDay() - 2 - index)}
                </div>)}
                
            {days.map(day =>
                <div className="border px-1 overflow-hidden"
                    key={day.getDate()}
                    onClick={addNewEvent}
                    onMouseEnter={() => setSelectedDate(day)}>
                        
                    <span className={`${isToday(day) ? "bg-blue-500 text-white font-bold px-1" : ""}`}>
                        {format(day, "d")}
                    </span>

                    <div className="flex-grow h-0 flex-basis-0">
                    {events.filter(event => isSameDate(event.date, day) && getGroupByName(event.groupName)?.isVisible).map((event, index) =>
                        <div className="border border-gray-400 hover:brightness-105 px-1
                                        cursor-default"
                            style={{background: getGroupColorByGroupName(event.groupName)}}
                            key={index}
                            onClick={(e) => editEvent(e, event)}>
                                
                            {event.title}
                        </div>)}
                    </div>
                    
                </div>)}
                
            {Array.from({length: 7 - getEndingDayIndex() - 1}).map((_, index) =>
                <div className="border px-1 border-gray-200 bg-gray-50 text-gray-400" key={index}>
                    {daysNextMonth[index].getDate()}
                </div>)}
        </div>

        <div>
            selected date: {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "none"}|
            mouse position: {mousePosition.top}, {mousePosition.left}|
            event calendar V3 (React)|
            quickCreateText: {quickCreateText}
        </div>
        
        {isDialogVisible &&
            <EventDialog events={events}
                        setEvents={setEvents}
                        setIsVisible={setIsDialogVisible}
                        selectedEvent={selectedEvent}
                        selectedDate={selectedDate}
                        isEditMode={isEditing}
                        mousePosition={mousePosition}/>}
    </div>
    );
}
