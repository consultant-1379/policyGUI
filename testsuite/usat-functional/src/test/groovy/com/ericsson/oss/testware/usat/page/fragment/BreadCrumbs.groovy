package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class BreadCrumbs implements PageFragment {
 
    @FindBy(xpath = "//I[@class='ebIcon ebIcon_small ebIcon_interactive ebIcon_downArrow_10px']")
    WebElement breadcrumbDropDown
    
    @FindBy(xpath = "//span[@class='ebComponentList-link'][text()='Execution Log']")
    WebElement executionDropDownItem

    @FindBy(xpath = "//span[@class='ebComponentList-link' and text() ='Decision Rules']")
    WebElement decisionRulesDropDownItem
    
    void clickBreadcrumbDropDown() {
        click(breadcrumbDropDown)
    }

    void clickExecutionLogDropDownItem(){
        click(executionDropDownItem)
    }
    
    void clickDecisionRulesDropDownItem(){
        click(decisionRulesDropDownItem)
    }

}
