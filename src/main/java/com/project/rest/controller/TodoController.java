package com.project.rest.controller;

import com.project.Constant;
import com.project.domain.Lists;
import com.project.domain.Notes;
import com.project.domain.Person;
import com.project.domain.User;
import com.project.domain.response.PersonPageResponse;
import com.project.service.ListsService;
import com.project.service.NotesService;
import com.project.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/todo")
public class TodoController {

    @Autowired
    private ListsService listsService;

    @Autowired
    private NotesService notesService;


    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Lists> getLists() {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Lists> result = listsService.findByUserId(user.getId());
        return result;
    }

    @RequestMapping(method = RequestMethod.DELETE)
    @ResponseBody
    public Long deleteList(@RequestBody String id) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long n_id = Long.parseLong(id);

        listsService.deepDelete(n_id);
        return n_id;
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public Lists insertList(@RequestBody String name) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Lists list = new Lists();
        list.setName(name);
        list.setUserId(user.getId());

        list = listsService.save(list);
        return list;
    }

    @RequestMapping(value= "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<Notes> getAllNotes(@PathVariable long id) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //если текущий юзер не имеет права получать записи из этого списка кидаем исключение
        if(listsService.checkAuthority(user,id) == false)
            throw new org.springframework.security.access.AccessDeniedException("403 returned");

        return notesService.findByListId(id);
    }

    @RequestMapping(value= "/{id}", method = RequestMethod.POST)
    @ResponseBody
    public Notes insertNote(@PathVariable long id,@RequestBody String desc) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //если текущий юзер не имеет права добавлять записи в этот список
        if(listsService.checkAuthority(user,id) == false)
            throw new org.springframework.security.access.AccessDeniedException("403 returned");

        Notes note = new Notes();
        note.setName(desc);
        note.setCheckmark(false);
        note.setListsid(id);

        note = notesService.save(note);
        return note;

    }

    @RequestMapping(value= "/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Long deleteNote(@PathVariable long id,@RequestBody String note_id) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Long n_id = Long.parseLong(note_id);

        //если текущий юзер не имеет права удалять записи из этого списка
        //или удаляемая запись отсутствует в данном списке кидаем исключение
        if(listsService.checkAuthority(user,id) == false
                || notesService.contains(id,n_id) == false)
            throw new org.springframework.security.access.AccessDeniedException("403 returned");

        notesService.delete(n_id);
        return n_id;

    }

    @RequestMapping(value= "/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public Notes editNote(@PathVariable long id,@RequestBody Notes reqNote){

        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //если текущий юзер не имеет права удалять записи из этого списка
        //или удаляемая запись отсутствует в данном списке кидаем исключение
        if(listsService.checkAuthority(user,id) == false
                || notesService.contains(id,reqNote.getId()) == false)
            throw new org.springframework.security.access.AccessDeniedException("403 returned");
        Notes note = notesService.findById(reqNote.getId());
        if(note == null)
            return null;
        note.setCheckmark(reqNote.getCheckmark());
        if(reqNote.getName() != null)
            note.setName(reqNote.getName());
        note = notesService.update(note);
        return note;
    }

}
