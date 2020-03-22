using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuController : MonoBehaviour
{
    private Canvas canvas;
    public bool paused = false;
    private void Start()
    {
        if(SceneManager.GetActiveScene().buildIndex == 1)
        {
            paused = false;
            canvas = GetComponent<Canvas>();
            canvas.enabled = false;
        }
    }

    private void Update()
    {

        if(SceneManager.GetActiveScene().buildIndex == 1)
        {
            if (Input.GetButtonDown("Cancel"))
            {
                paused = !paused;

                if (!paused)
                {
                    canvas.enabled = false;
                    Resume();
                }


                if (paused)
                {
                    canvas.enabled = true;
                    Pause();
                }
            }
        }
    }

    private void Pause()
    {
        Time.timeScale = 0f;
    }
    private void Resume()
    {
        Time.timeScale = 1f;
    }

    public void PlayGame()
    {
        Resume();
        SceneManager.LoadScene(1);
    }

    public void ReturntoMain()
    {
        Resume();
        SceneManager.LoadScene(0);
    }

    public void ExitGame()
    {
        PlayerPrefs.DeleteAll();
        Application.Quit();
    }
}
