package br.com.amooora.users.database.repository;

import br.com.amooora.users.database.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u from User u where u.email like :email")
    Optional<User> findUserByEmail(String email);

}
