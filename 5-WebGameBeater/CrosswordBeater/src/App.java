import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;

public class App {
    public static void main(String[] args) throws Exception {
        WebDriver driverCrossword = new ChromeDriver();
        WebDriver driverClues = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driverCrossword, Duration.ofSeconds(10));
        driverCrossword.get("https://www.dictionary.com/e/crossword/");
        driverClues.get("https://www.wordplays.com/crossword-solver/");
        

        WebElement cookies1 = driverCrossword.findElement (By.xpath ("//*[contains(text(),'Accept All Cookies')]"));
        
        cookies1.click();
        
        
        // Get 1st clue
        WebElement playnow = driverCrossword.findElement(By.xpath ("//*[contains(text(),'Play Now')]"));
        playnow.click();

        driverCrossword.switchTo().frame("amuembedframe");
        driverCrossword.switchTo().frame(driverCrossword.findElement(By.className("game-iframe")));
        driverCrossword.switchTo().frame("iconsole-plugin-session_iframe__");

        WebElement difficulty = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("regular")));
        difficulty.click();

        
        // Get all across clues
        List<WebElement> acrossClues = driverCrossword.findElement(By.id("across_clues")).findElements(By.xpath("./*"));
        
        
        for (WebElement clue : acrossClues) {
            String clueText = clue.findElement(By.xpath(".//span")).getText();
            String clueNum = clue.findElement(By.xpath(".//b")).getText();

            WebElement firstBox = driverCrossword.findElement(By.id("canvas")).findElement(By.xpath(".//*[contains(text(),'" + clueNum + "')]")).findElement(By.xpath("./.."));
            String startId = firstBox.getAttribute("id");


            ArrayList<String> ids = new ArrayList<>();

            String[] idParts = startId.split("_");

            for (int i = 0; i < 15; i++) {
                int idY = Integer.parseInt(idParts[1]) + i;
                if (idY > 14) {
                    break;
                }

                String newId = idParts[0] + "_" + idY;
                if (!driverCrossword.findElement(By.id(newId)).getAttribute("class").contains("black")) {
                    ids.add(newId);
                } else {
                    break;
                }
            }


            // Search for clue
            WebElement clueInput = driverClues.findElement(By.id("clue"));
            clueInput.clear();
            clueInput.sendKeys(clueText);

            WebElement sizeInput = driverClues.findElement(By.id("pattern"));
            sizeInput.clear();
            for (int i = 0; i < ids.size(); i++) {
                sizeInput.sendKeys("?");
            }

            WebElement findAnswers = driverClues.findElement (By.name("go"));
            findAnswers.click();

            // List<WebElement> answers = driverClues.findElement(By.id("wordlists")).findElements(By.className("row clue"));
            List<WebElement> answers = driverClues.findElement(By.id("wordlists")).findElements(By.cssSelector("[class*='row clue']"));

            boolean searching = true;
            int answId = 0;
            while (searching == true) {
                System.out.println("full: " + answers.get(answId).getText());
                String answer = answers.get(answId).findElement(By.xpath(".//td[2]/a")).getText().replaceAll("\\s","");
                String[] letters = answer.split("");
                System.out.println(answer);

                answId++;
                
                // Try enter answer
                boolean incorrect = false;
                for (int i = 0; i < ids.size(); i++) {
                    String id = ids.get(i);
                    new Actions(driverCrossword).sendKeys(driverCrossword.findElement(By.id(id)) , letters[i]).perform();
    
                    // Check if letter is correct
                    if (driverCrossword.findElement(By.id(id)).findElement(By.xpath(".//div")).getAttribute("class").contains("wrong")) {
                        incorrect = true;
                        break;
                    }
                }

                searching = incorrect;
            }
        }
        
        driverClues.quit();
    }
}
