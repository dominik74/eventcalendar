import { useEffect, useState } from 'react'
import './App.css'
import EventCalendar from './components/EventCalendar'
import GroupManager from './components/GroupManager'
import Settings from './components/Settings';

export interface Group {
  name: string;
  color: string;
  isVisible: boolean;
}

export interface CalendarEvent {
  title: string;
  date: Date;
  groupName: string;
}

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [groups, setGroups] = useState<Group[]>([
    {name: "default", color: "#e5e7eb", isVisible: true},
  ]);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  
  
  return (
    <div className="flex">
      <GroupManager className="w-128 bg-gray-100 border-r border-gray-300 px-2
                               h-screen"
                    groups={groups}
                    setGroups={setGroups}
                    setIsSettingsVisible={setIsSettingsVisible} />
                    
      <EventCalendar className="flex-1 m-2 flex flex-col"
                     events={events}
                     setEvents={setEvents}
                     groups={groups} />

      {isSettingsVisible &&
        <Settings setIsVisible={setIsSettingsVisible} />}
    </div>
  )
}

export default App;
