using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class leaderboardController : MonoBehaviour
{
    public Transform entryContainer;
    public Transform entryTemplate;
    private List<Transform> highScoreEntryTransformList;

    public int scoresToShow = 10;
    public float templateHeight = 30f;

    private void Awake()
    {
        entryTemplate.gameObject.SetActive(false); // hide our placeholder template

        string jsonString = PlayerPrefs.GetString("LeaderboardTable"); // load our json file of scores
        if(!string.IsNullOrEmpty(jsonString))
        {
            LeaderBoard leaderboard = JsonUtility.FromJson<LeaderBoard>(jsonString); // fill in our leaderboard class with the scores
            // Insertion Sort
            for(int i = 0; i < leaderboard.highScoreEntryList.Count; i++)
                for(int j = i+1; j < leaderboard.highScoreEntryList.Count; j++)
                {
                    if(leaderboard.highScoreEntryList[j].score > leaderboard.highScoreEntryList[i].score)
                    { // swap
                        HighScoreEntry tmp = leaderboard.highScoreEntryList[i];
                        leaderboard.highScoreEntryList[i] = leaderboard.highScoreEntryList[j];
                        leaderboard.highScoreEntryList[j] = tmp;
                    }
                }

            while(leaderboard.highScoreEntryList.Count > 9) // trim excess high scores after sorting is done
            {
                leaderboard.highScoreEntryList.RemoveRange(9, leaderboard.highScoreEntryList.Count-9);
            }

            // create the actual scores in the game
            highScoreEntryTransformList = new List<Transform>();
            foreach (HighScoreEntry highScoreEntry in leaderboard.highScoreEntryList)
                CreateHighScoreEntryTransform(highScoreEntry, entryContainer, highScoreEntryTransformList);
        }
    }
    
    private void CreateHighScoreEntryTransform(HighScoreEntry highScoreEntry, Transform container, List<Transform> transformList)
    {
        Transform entryTransform = Instantiate(entryTemplate, container); // instantiate the entry
        RectTransform entryRectTransform = entryTransform.GetComponent<RectTransform>(); // copy recttransform from template
        entryRectTransform.anchoredPosition = new Vector2(0, -templateHeight * transformList.Count); // move it down by however many pixels

        entryTransform.gameObject.SetActive(true); // unhide

        string name = highScoreEntry.name; // set name
        entryTransform.Find("Name").GetComponent<TextMeshProUGUI>().text = name;

        int score = highScoreEntry.score; // set score
        entryTransform.Find("Score").GetComponent<TextMeshProUGUI>().text = score.ToString();

        entryTransform.Find("BG").gameObject.SetActive(transformList.Count % 2 == 0);
        if (transformList.Count == 0)
        {
            entryTransform.Find("Name").GetComponent<TextMeshProUGUI>().color = Color.green;
            entryTransform.Find("Score").GetComponent<TextMeshProUGUI>().color = Color.green;
        }

        transformList.Add(entryTransform);
    }
    public void AddHighScoreEntry(int score, string name)
    {
        // Create Entry
        HighScoreEntry highscoreEntry = new HighScoreEntry { score = score, name = name };

        // Add to Table
        string jsonString = PlayerPrefs.GetString("LeaderboardTable", JsonUtility.ToJson( new List<HighScoreEntry> { new HighScoreEntry { score = 0, name = "---" } }) );
        LeaderBoard leaderboard = JsonUtility.FromJson<LeaderBoard>(jsonString);
        leaderboard.highScoreEntryList.Add(highscoreEntry);

        // Save as Json
        string json = JsonUtility.ToJson(leaderboard);
        PlayerPrefs.SetString("LeaderboardTable", json);
        PlayerPrefs.Save();

    }

    public int FindHighScore()
    {
        int highscore = 0;
        string jsonString = PlayerPrefs.GetString("LeaderboardTable");
        if (!string.IsNullOrEmpty(jsonString))
        {
            LeaderBoard leaderboard = JsonUtility.FromJson<LeaderBoard>(jsonString);
            foreach (HighScoreEntry highScoreEntry in leaderboard.highScoreEntryList)
                if (highscore < highScoreEntry.score)
                    highscore = highScoreEntry.score;

            return highscore;
        }
        else
            return 0;
    }

    public bool DidIPlace(int score)
    {
        string jsonString = PlayerPrefs.GetString("LeaderboardTable");
        if (!string.IsNullOrEmpty(jsonString))
        {
            LeaderBoard leaderboard = JsonUtility.FromJson<LeaderBoard>(jsonString);

            if (leaderboard.highScoreEntryList.Count < 9)
                return true;
            else
                if (score < leaderboard.highScoreEntryList[8].score)
                    return false;
                else
                    return true;
        }
        else
            return true;
    }

    private class LeaderBoard // class so we can save as a json
    {
        public List<HighScoreEntry> highScoreEntryList; // list of highscores
    }

    [System.Serializable]
    private class HighScoreEntry // an individual entry
    {
        public int score;
        public string name;
    }
}
