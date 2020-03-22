using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class Scoreboard : MonoBehaviour
{
    public TextMeshProUGUI scoreBoard;
    public TextMeshProUGUI highScore;
    public leaderboardController lc;
    public int score = 0;

    public float scoreRate = 1f;

    private float nextTimetoScore = 3f;
    // Start is called before the first frame update
    void Awake()
    {
        score = 0;
        nextTimetoScore = Time.time + 3f;
    }

    private void Start()
    {
        highScore.text = lc.FindHighScore().ToString();
    }

    // Update is called once per frame
    void Update()
    {
        if (Time.time >= nextTimetoScore)
        {
            score++;
            scoreBoard.text = score.ToString("0");

            nextTimetoScore = Time.time + 1 / scoreRate;

            if ( score > lc.FindHighScore() )
            {
                highScore.text = score.ToString();
            }
        }
    }

}
