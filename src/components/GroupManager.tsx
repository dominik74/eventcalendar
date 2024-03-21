import { useState } from "react";
import { Group } from "../App";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  setIsSettingsVisible: (arg0: boolean) => void;
}

export default function GroupManager({groups, setGroups, className,
                                      setIsSettingsVisible} : Props) {
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#ffffff");
  
    function addGroup() {
      var groupNameLocal = groupName.trim().replace(/\s/g, "");
      
      if (groupNameLocal === "") {
        return;
      }
      
      if (groups.find(group => group.name === groupNameLocal)) {
        return;
      }
      
      setGroups([...groups, {name: groupNameLocal, color: groupColor, isVisible: true}]);
      setGroupName("");
    }
    
    function deleteGroup(groupName: string) {
      const updatedGroups = groups.filter(group => group.name !== groupName);
      setGroups(updatedGroups);
    }

    function toggleSettings() {
      setIsSettingsVisible(true);
    }
  
    return (
      <div className={className}>
        {/*<h3 className="mb-4 mt-2 border border-gray-300 bg-gray-200">group manager</h3>*/}
        {/*className="bg-transparent border-transparent border-b-gray-300 px-0 mt-3"*/} 
        <input className="mt-3"
               type="text"
               placeholder="new group"
               value={groupName}
               onChange={e => setGroupName(e.target.value)}
               onKeyDown={e => e.key === "Enter" && addGroup()} />
               
        <input type="color"
               value={groupColor}
               onChange={e => setGroupColor(e.target.value)} />
               
        <button className="text-lg"
                onClick={addGroup}>
          +
        </button>
        
        <ul className="mt-2">
          {groups.map(group =>
            <li key={group.name}>
              <button onClick={() => deleteGroup(group.name)}
                      disabled={group.name === "default"}>
                X
              </button>
              
              <input className="ml-2"
                     type="checkbox"
                     checked={group.isVisible}
                     onChange={() => setGroups(groups.map(g => g.name === group.name ? {...g, isVisible: !g.isVisible} : g))} />
              
              <input type="color"
                     value={group.color}
                     onChange={e => setGroups(groups.map(g => g.name === group.name ? {...g, color: e.target.value} : g))} />
                     
              <span> {group.name}</span>
            </li>)}
        </ul>
        
        <button className="fixed bottom-2 left-2 w-56" onClick={toggleSettings}>
          settings...
        </button>
      </div>  
    );
}
