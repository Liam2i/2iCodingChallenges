using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.Video;

public class GameController : MonoBehaviour
{
    public static GameController gameController;
    public GameObject startScreen;
    public GameObject endScreen;
    public Image nextBlock;

    public VideoPlayer video;

    public List<double> times;
    public List<Sprite> blocks;

    public int lives = 3;

    public Text lifeText;

    public bool done = false;

    // Start is called before the first frame update
    void Start()
    {
        gameController = this;
        video.loopPointReached += WinGame;
        nextBlock.sprite = blocks[0];
        //video.time = 55;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape)) {
            Application.Quit();
        }
        if (done == false) {
            if (lives <= 0) {
                LoseGame();
                return;
            }

            if (!video.isPlaying) {
                TryClick();
            } else if (times.Count > 0) {
                if (video.time > times[0]) {
                    video.Pause();
                }
            }
        }
    }

    void TryClick() {
        if (Input.GetMouseButtonDown(0)) {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit2D hit = Physics2D.GetRayIntersection(ray,Mathf.Infinity);
           
            if (hit.collider != null && hit.collider.transform.TryGetComponent<IHole>(out IHole hole)) {
                hole.GetClicked();
            }
        }
    }

    public void NextSection() {
        times.RemoveAt(0);
        blocks.RemoveAt(0);

        if (blocks.Count == 0) {
            nextBlock.enabled = false;
        } else {
            nextBlock.overrideSprite = blocks[0];
        }
        video.Play();

    }

    public void RemoveLife() {
        lives -= 1;

        lifeText.text = "Lives: " + lives.ToString();
    }

    void WinGame(VideoPlayer video) {
        done = true;
        endScreen.SetActive(true);
        endScreen.transform.Find("Title").GetComponent<Text>().text = "You Won!";
    }

    public void LoseGame() {
        done = true;
        endScreen.SetActive(true);
        endScreen.transform.Find("Title").GetComponent<Text>().text = "You Lost!";
    }

    public void StartGame() {
        startScreen.SetActive(false);
        done = false;
        video.Play();
    }

    public void Restart() {
        Scene scene = SceneManager.GetActiveScene(); 
        SceneManager.LoadScene(scene.name);
    }

    public void Quit() {
        Application.Quit();
    }
}
