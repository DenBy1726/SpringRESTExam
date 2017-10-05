package com.project.service.base;

import com.project.domain.IEntity;
import com.project.persistence.PersonMapper;
import com.project.persistence.base.IMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Denis on 25.08.2017.
 */
public abstract class DBService<T extends IEntity> implements IDBService<T> {

    protected abstract IMapper<T> getMapper();

    @Override
    public List<T> findAll() {
        return getMapper().findAll();
    }

    @Override
    public List<T> findRange(int from,int ammount){
        return getMapper().findRange(from,ammount);
    }

    @Override
    public T findById(Long id){
        return getMapper().findById(id);
    }

    @Override
    @Transactional
    public T save(T data) {
        if (data.getId() == null) {
            insert(data);
        } else {
            update(data);
        }
        return data;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        getMapper().delete(id);
    }

    @Override
    @Transactional
    public void delete(T data) {
        delete(data.getId());
    }

    @Override
    public void clear() {
        getMapper().clear();
    }

    @Override
    @Transactional
    public T insert(T data){
        getMapper().insert(data);
        return data;
    }

    @Override
    @Transactional
    public T update(T data) {
        getMapper().update(data);
        return data;
    }

    @Override
    public Long size(){
        Long size =  getMapper().size();
        return size;
    }

}
