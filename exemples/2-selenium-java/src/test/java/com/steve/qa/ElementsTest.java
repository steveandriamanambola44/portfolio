package com.steve.qa;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

@DisplayName("Éléments d'interface")
class ElementsTest extends BaseTest {

    @Test
    @DisplayName("Cocher et décocher des cases")
    void casesACocher() {
        driver.get(BASE_URL + "/checkboxes");
        List<WebElement> boxes = driver.findElements(By.cssSelector("#checkboxes input"));

        boxes.get(0).click();
        boxes.get(1).click();

        assertTrue(boxes.get(0).isSelected());
        assertFalse(boxes.get(1).isSelected());
    }

    @Test
    @DisplayName("Sélection dans une liste déroulante")
    void listeDeroulante() {
        driver.get(BASE_URL + "/dropdown");
        Select select = new Select(driver.findElement(By.id("dropdown")));

        select.selectByVisibleText("Option 2");

        assertEquals("Option 2", select.getFirstSelectedOption().getText());
    }

    @Test
    @DisplayName("Confirmation JavaScript acceptée puis refusée")
    void alertesJavaScript() {
        driver.get(BASE_URL + "/javascript_alerts");
        By confirmButton = By.cssSelector("button[onclick='jsConfirm()']");
        By result = By.id("result");

        driver.findElement(confirmButton).click();
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        alert.accept();
        assertEquals("You clicked: Ok", driver.findElement(result).getText());

        driver.findElement(confirmButton).click();
        wait.until(ExpectedConditions.alertIsPresent()).dismiss();
        assertEquals("You clicked: Cancel", driver.findElement(result).getText());
    }

    @Test
    @DisplayName("Attente explicite d'un contenu chargé dynamiquement")
    void chargementDynamique() {
        driver.get(BASE_URL + "/dynamic_loading/2");
        driver.findElement(By.cssSelector("#start button")).click();

        WebElement message = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#finish h4")));

        assertEquals("Hello World!", message.getText());
    }
}
