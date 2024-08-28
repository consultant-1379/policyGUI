package com.ericsson.oss.testware.usat.page.fragment

import com.ericsson.oss.testware.usat.page.ability.WaitAbility
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class DecisionRulePanel implements PageFragment, WaitAbility{
    
    @FindBy(css = ".elTablelib-Table-body > tr:nth-child(1) > td:nth-child(1)")
    WebElement checkbox
    
    @FindBy(xpath = "//*[text()='Status']")
    WebElement status

    @FindBy(xpath = "//*[text()='Asset Type']")
    WebElement assetType

    @FindBy(xpath = "//span[text() ='Edit']")
    WebElement editButton

    @Override
    void waitForLoad() {
        waitVisible(status)
    }

    void clickStatus() {
        click(status)
    }

    void clickAssetType() {
        pause()
        click(assetType)
    }

    String getTitle() {
        waitPresent(title)
        return title.getText();
    }

    void clickFirstCheckbox() {
        pause()
        click(checkbox)
        waitVisible(editButton)

    }

    synchronized void pause() {
        wait(5000)
    }
}
