package com.steve.qa;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.steve.qa.pages.LoginPage;

@DisplayName("Formulaire de connexion")
class LoginTest extends BaseTest {

    @Test
    @DisplayName("Connexion réussie avec des identifiants valides")
    void connexionValide() {
        LoginPage page = new LoginPage(driver, wait).open(BASE_URL);
        page.login("tomsmith", "SuperSecretPassword!");

        assertTrue(page.flashMessage().contains("You logged into a secure area!"));
        assertTrue(driver.getCurrentUrl().endsWith("/secure"));
    }

    @ParameterizedTest(name = "Refus : utilisateur=''{0}'', mot de passe=''{1}''")
    @CsvSource({
        "inconnu,  SuperSecretPassword!, Your username is invalid!",
        "tomsmith, mauvais,              Your password is invalid!",
        "'',       '',                   Your username is invalid!"
    })
    void connexionRefusee(String user, String pass, String messageAttendu) {
        LoginPage page = new LoginPage(driver, wait).open(BASE_URL);
        page.login(user, pass);

        assertTrue(page.flashMessage().contains(messageAttendu));
    }
}
