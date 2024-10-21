import {useState } from "react";

/**
 * Custom hook used to orchestrate a list of 
 * selected words and unselected words for the WordShuffleLesson component
 * @param {*} selected should be an empty list 
 * @param {*} unselected list containing all words, order will be based on id class variable
 * @returns 
 */
export function useShuffledWords(selectedWords, unselectedWords){
    const [selected, setSelected] = useState(selectedWords);
    const [unselected, setUnselected] = useState(unselectedWords);

    /**
     * removes word from unselected list and adds to end of selected list 
     */
    function select(id) {
        var unselectedIndex = -1;
        unselected.forEach((word, index) => {
            if (word.getId() === id) {
                setSelected((prev) =>[...prev, word]);
                unselectedIndex = index;
            }
        });
        
        unselectedIndex > -1 && setUnselected((prev) => [...prev.slice(0, unselectedIndex), ...prev.slice(unselectedIndex+1)]) ;

    }
    /**
     * removes word from selected list and left shifts all elements after
     * and adds to unselected list
     * @param {*} id 
     */
    function unselect(id) {
        var selectedIndex = -1;
        selected.forEach((word, index) => {
            if (word.getId() === id) {
                setUnselected((prev) =>[...prev, word]);
                selectedIndex = index;
            }
        });
        
        selectedIndex > -1 && setSelected((prev) => [...prev.slice(0, selectedIndex), ...prev.slice(selectedIndex+1)]) ;

    }

    return {
        selected,
        unselected,
        select,
        unselect,
        setSelected,
        setUnselected
        
    }
}